const JWT = require("jsonwebtoken");

const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const { Error } = require("mongoose");

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

// verify user having a valid session
exports.auth = (req, res, next) => {
  res.json({
    status: "success",
    token: req.headers.authorization?.split(" ")[1] || req.cookies.token,
    userDetails: req.userDetails,
  });
};
