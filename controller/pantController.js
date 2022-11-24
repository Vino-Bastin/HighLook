const Pant = require("./../model/pantModel");
const Order = require("./../model/orderModel");

const orderController = require("./orderController");

const catchAsync = require("./../utils/catchAsync");

//create a pant
exports.createPant = catchAsync(async function (req, res, next) {
  const order = await Order.findById(req.body.orderId);

  if (order.lineItems.pants) {
    throw new Error(
      "You are not allowed to create multiple pants under one order"
    );
  }

  const response = await Pant.create(req.body);

  res.status(200).json({
    status: "success",
    data: response,
  });
});

// get a pant
exports.getPant = catchAsync(async function (req, res, next) {
  const response = await Pant.findById(req.params.pantId);

  if (!response) {
    throw new Error(`No pant record found with this id ${req.params.pantId}`);
  }
  res.json({
    status: "success",
    data: response,
  });
});

// get all pants for order
exports.getAllPantsForOrder = catchAsync(async function (req, res, next) {
  const response = await Pant.find({
    orderNumber: { $eq: req.params.orderId },
  });

  res.json({
    status: "success",
    data: response,
  });
});

// get all pants
exports.getAllPants = catchAsync(async function (req, res, next) {
  const response = await orderController.pagination(
    Pant.find(req.filterCondition),
    req
  );

  res.json({
    status: "success",
    data: response,
  });
});

//update a pant details
exports.updatePant = catchAsync(async function (req, res, next) {
  delete req.body._id;
  delete req.body.orderNumber;

  const response = await Pant.findOneAndUpdate(
    { _id: req.params.pantId },
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
