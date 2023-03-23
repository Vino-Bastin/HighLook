const JWT = require("jsonwebtoken");

const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const { Error } = require("mongoose");
const {
  sendLoginMail,
  sendPasswordResetMail,
  sendPasswordResetSuccessMail,
  sendNewUserMail,
} = require("../utils/mailService");

// create JWT
const generateJWT = async function (object) {
  return await JWT.sign(object, process.env.JWT_SECRET_KEY, {
    expiresIn: 60 * 60 * 48,
  });
};

// verify JWT
const JWTData = async function (token) {
  return await JWT.verify(token, process.env.JWT_SECRET_KEY);
};

// send JWT and Cookie
const sendJWTAndCookie = function (res, token, userDetails) {
  res.cookie("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60 * 48,
  });
  res.status(200).json({
    status: "success",
    token,
    userDetails,
  });
};

// verify user is authenticated
exports.isAuthenticated = catchAsync(async function (req, res, next) {
  if (!req.headers.authorization?.split(" ")[1] && !req.cookies.token) {
    throw new Error(`your not signing , please signing`);
  }
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  const id = await JWTData(token);
  const response = await User.findById(id.id);
  if (!response) {
    throw new Error("No user found with the ID");
  }
  req.userID = response._id;
  req.userDetails = response;
  return next();
});

// protect router Against the given user
exports.protectRoute = (...users) => {
  return catchAsync(async function (req, res, next) {
    if (users.includes(req.userDetails.role)) {
      return next();
    }
    throw new Error("Your Not authorized to access this page");
  });
};

// create a tailor
exports.signup = catchAsync(async function (req, res, next) {
  const response = await User.create(req.body);

  sendNewUserMail(response.firstName, response.email, response.role);

  res.status(200).json({
    status: "success",
    message: `New Account was created with ${response.firstName} name and email ${response.email}`,
  });
});

// tailor login
exports.login = catchAsync(async function (req, res, next) {
  if (!req.body.email || !req.body.password) {
    throw new Error("please provide a email and password");
  }
  const response = await User.findOne({
    email: { $eq: req.body.email },
  }).select("+password");
  if (!response) {
    throw new Error(
      `No User found with this ${req.body.email} email ID , please provide a valid one`
    );
  }
  if (!(await response.isPasswordCorrect(req.body.password))) {
    throw new Error(`please provide correct password`);
  }
  const userDetails = { ...response._doc };
  delete userDetails["password"];
  const token = await generateJWT({ id: response._id });

  sendJWTAndCookie(res, token, userDetails);
  sendLoginMail(req.body.email, response.firstName, req._remoteAddress);
});

// logout
exports.logout = catchAsync(async function (req, res, next) {
  res.clearCookie("token", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
  });
  res.json({
    status: "success",
  });
});

// verify user having a valid session and extend the user session
exports.auth = catchAsync(async function (req, res, next) {
  const token = await generateJWT({ id: req.userDetails._id });

  sendJWTAndCookie(res, token, req.userDetails);
});

// Password Reset Mail
exports.sendPasswordResetMail = catchAsync(async function (req, res, next) {
  if (!req.body.email)
    throw new Error("Please Provide email Id to send password reset mail");

  const user = await User.findOne({ email: req.body.email });

  if (!user)
    throw new Error(
      "No User Found with provided email Id , Please Provide correct one"
    );

  const token = await JWT.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: 60 * 10,
  });

  await User.findByIdAndUpdate(user._id, { passwordResetToken: token });

  sendPasswordResetMail(`${process.env.URL}${token}`, user.email);

  res.json({
    status: "success",
    message:
      "Password Reset mail sended. Please check your mail inbox and it valid for next 10 minutes.",
  });
});

// Password Reset
exports.resetPassword = catchAsync(async function (req, res, next) {
  if (!req.body.passwordResetToken)
    throw new Error(
      "You don't have a token. So your not allowed to reset your password. Please send a password reset request"
    );

  if (!req.body.email) throw new Error("Please Provide email id");
  if (!req.body.password || !req.body.confirmPassword)
    throw new Error("Please Provide Password and confirm Password.");
  if (req.body.password.length < 9)
    throw new Error("Password must have 9 OR More characters.");
  if (!(req.body.password === req.body.confirmPassword))
    throw new Error("Password and ConfirmPassword Must be same");

  let userId;
  try {
    userId = await JWTData(req.body.passwordResetToken);
  } catch (e) {
    throw new Error("Your Password reset token was Expired. Please try again");
  }

  if (!userId.id)
    throw new Error(
      "Something went wrong with your password reset token please try again"
    );

  const user = await User.findById(userId.id).select("+passwordResetToken");

  if (!(req.body.passwordResetToken === user.passwordResetToken))
    throw new Error("Your password is not matched please try with new one");

  if (!user || user.email !== req.body.email)
    throw new Error(
      "No User found with given email. please try again with correct one."
    );

  user.passwordResetToken = "";
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.save();

  sendPasswordResetSuccessMail(user.firstName, user.email);

  res.json({
    status: "success",
    message: "Your password has been rested. please login with new password.",
  });
});
