const catchAsync = require("../utils/catchAsync");

const { Error } = require("mongoose");

const User = require("../model/userModel");
const Pant = require("../model/pantModel");
const Shirt = require("../model/shirtModel");

const orderController = require("./orderController");

//------------------------------------ start of helper and middleware functions ------------------------------------------
const paymentDataFormat = (data, item) => {
  let result = [];
  data.forEach((value) => {
    result.push({
      [item]: value[item],
      name: `${value._id.firstName} ${value._id.lastName}`,
      role: value._id.role,
    });
  });

  return result;
};

const generatePipeLine = (req, item) => {
  return [
    {
      $match: {
        $and: [
          {
            orderDate: {
              $gte: new Date(req.query.startDate),
              $lte: new Date(req.query.endDate),
            },
          },
          { status: req.query.orderStatus },
        ],
      },
    },
    {
      $group: {
        _id: "$assignedTo",
        [item]: { $sum: "$quantity" },
      },
    },
  ];
};

//------------------------------------ end of helper and middleware functions ------------------------------------------

// update user details (password only)
exports.updateUserDetails = catchAsync(async function (req, res, next) {
  if (!req.body.password || !req.body.confirmPassword) {
    throw new Error("please provide password and confirm password");
  }

  if (!(req.body.password === req.body.confirmPassword)) {
    throw new Error("password anf confirmPassword must be same");
  }

  if (req.body.password.length <= 9) {
    throw new Error("password must contains at least 8 characters");
  }

  const user = await User.findById(req.userID);
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.save();

  res.clearCookie("token");
  res.json({
    status: "success",
    message: "Your password has been changed , please login again",
  });
});

// get all tailors
exports.getAllUsers = catchAsync(async function (req, res, next) {
  const response = await User.find().select("+_id +firstName");

  let result = [];
  response.forEach((user) => {
    result.push({
      value: user._id,
      name:
        user.firstName.charAt(0).toUpperCase() +
        user.firstName.slice(1) +
        " " +
        user.lastName.charAt(0).toUpperCase() +
        user.lastName.slice(1),
    });
  });

  res.json({
    status: "success",
    data: result,
  });
});

// get my work details
exports.getMyWork = catchAsync(async function (req, res, next) {
  const shirts = await orderController.pagination(
    Shirt.find({
      ...req.filterCondition,
      assignedTo: req.userID,
    }),
    req
  );
  const pants = await orderController.pagination(
    Pant.find({
      ...req.filterCondition,
      assignedTo: req.userID,
    }),
    req
  );

  res.json({
    status: "success",
    data: {
      shirts,
      pants,
    },
  });
});

// get payment details
exports.getPaymentDetails = catchAsync(async function (req, res, next) {
  if (!req.query.orderStatus || !req.query.startDate || !req.query.endDate) {
    throw new Error(
      "Please provide Order Status , Start Date and End Date to get Payments Details"
    );
  }

  if (
    new Date(req.query.endDate) - new Date(req.query.startDate) <=
    518400000
  ) {
    throw new Error(
      "please Start Date and End Date , that has at least one week different"
    );
  }

  const shirtResponse = await Shirt.aggregate(generatePipeLine(req, "shirt"));
  const pantResponse = await Pant.aggregate(generatePipeLine(req, "pant"));

  const shirtData = paymentDataFormat(
    await Shirt.populate(shirtResponse, {
      path: "_id",
      model: "users",
    }),
    "shirt"
  );
  const pantData = paymentDataFormat(
    await Pant.populate(pantResponse, {
      path: "_id",
      model: "users",
    }),
    "pant"
  );

  let data = {};
  [...pantData, ...shirtData].forEach(
    (val) => (data[val.name] = { ...data[val.name], ...val })
  );

  data = Object.entries(data).map((val) => val[1]);

  res.json({
    status: "success",
    data,
  });
});
