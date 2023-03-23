const Shirt = require("./../model/shirtModel");
const Order = require("../model/orderModel");

const orderController = require("./orderController");

const catchAsync = require("./../utils/catchAsync");

// get all shirts for a order
exports.getAllShirtsForOrder = catchAsync(async function (req, res, next) {
  const response = await Shirt.find({
    orderNumber: { $eq: req.params.orderId },
  });

  res.json({
    status: "success",
    data: response,
  });
});

// get a shirt
exports.getShirt = catchAsync(async function (req, res, next) {
  const response = await Shirt.findById(req.params.shirtId);

  if (!response) {
    throw new Error(`no shirt record found with this id ${req.params.shirtId}`);
  }
  res.json({
    status: "success",
    data: response,
  });
});

// create a shirt
exports.createShirt = catchAsync(async function (req, res, next) {
  const order = await Order.findById(req.body.orderId);

  if (order.lineItems.shirts) {
    throw new Error(
      "You are not allowed to create multiple shirts under one order"
    );
  }

  const response = await Shirt.create(req.body);

  res.json({
    status: "success",
    data: response,
  });
});

// get all shirts
exports.getAllShirts = catchAsync(async function (req, res, next) {
  const response = await orderController.pagination(
    Shirt.find(req.filterCondition),
    req
  );

  res.json({
    status: "success",
    data: response,
  });
});

// update shirt details
exports.updateShirt = catchAsync(async function (req, res, next) {
  delete req.body._id;
  delete req.body.orderNumber;

  const response = await Shirt.findOneAndUpdate(
    { _id: req.params.shirtId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({
    status: "success",
    data: response,
  });
});
