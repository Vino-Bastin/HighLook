const Order = require("./../model/orderModel");
const Pant = require("./../model/pantModel");
const Shirt = require("./../model/shirtModel");

const catchAsync = require("./../utils/catchAsync");

const MONTHINSTRING = [
  ,
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//------------------------------------ start of helper and middleware functions ------------------------------------------
// check whether order is active
exports.isActiveOrder = catchAsync(async function (req, res, next) {
  const response = await Order.findOne({
    orderNumber: { $eq: `${req.params.orderId}` },
  }).select("+isActive");

  if (!response || (!req.userDetails.role === "admin" && !response.isActive)) {
    throw new Error(
      `No order found with this ${req.params.orderId} orderId , please provide valid one`
    );
  }

  req.body.orderId = response._id;
  req.body.orderNumber = req.params.orderId;
  return next();
});

// process query
exports.getFilters = catchAsync(async function (req, res, next) {
  let filterCondition = { isActive: true };
  if (req.query.orderNumber) {
    filterCondition = {
      ...filterCondition,
      orderNumber: req.query.orderNumber,
    };
    delete filterCondition.isActive;
  }

  if (!req.query.startDate && req.query.endDate) {
    throw new Error("Please provide start Date to filter Items.");
  }
  if (req.query.startDate) {
    filterCondition = {
      ...filterCondition,
      orderDate: {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate || Date.now()),
      },
    };
  }
  req.filterCondition = filterCondition;
  return next();
});

// pagination
const pagination = function (query, req) {
  const limit = req.query.limit || 2;

  if (!req.query.page) {
    return query;
  }

  if (req.query.page <= 0) {
    throw new Error("Page value must be greater than or equal to 1");
  }

  return query.limit(limit).skip(limit * (req.query.page - 1));
};

exports.pagination = pagination;

// generate unique orderNumber
const generateOrderNumber = () => {
  return new Date().valueOf();
};

const statisticsDataFormat = (data) => {
  const statisticsData = [];
  MONTHINSTRING.forEach((month, index) => {
    statisticsData[index - 1] = { _id: index, value: 0, month };
  });

  data.forEach((value) => {
    statisticsData[value._id - 1] = value;
  });
  return statisticsData;
};

//------------------------------------ end of helper and middleware functions ------------------------------------------

// get all orders
exports.getAllOrders = catchAsync(async function (req, res, next) {
  const query = Order.find(req.filterCondition).sort("+orderDate");
  if (req.query.populate) {
    query
      .populate({
        path: "lineItems.pants",
        strictPopulate: false,
      })
      .populate({
        path: "lineItems.shirts",
        strictPopulate: false,
      });
  }
  const response = await pagination(query, req);

  res.status(200).json({
    status: "success",
    data: response,
  });
});

// create a order
exports.createOrder = catchAsync(async function (req, res, next) {
  delete req.body.orderDate;
  req.body.orderNumber = generateOrderNumber();

  const response = await Order.create(req.body);

  res.status(200).json({
    status: "success",
    data: response,
  });
});

// get a order
exports.getOrder = catchAsync(async function (req, res, next) {
  const query = Order.findOne({
    orderNumber: { $eq: `${req.params.orderId}` },
  });
  if (req.query.populate) {
    query
      .populate({
        path: "lineItems.pants",
        strictPopulate: false,
      })
      .populate({
        path: "lineItems.shirts",
        strictPopulate: false,
      });
  }
  const response = await query;
  if (!response) {
    throw new Error(
      `no Order find with ${req.params.orderId} this id, please provide a valid one`
    );
  }
  res.status(200).json({
    status: "success",
    data: response,
  });
});

// get order status
exports.status = catchAsync(async function (req, res, next) {
  const response = await Order.findOne({
    orderNumber: { $eq: `${req.params.orderId}` },
  })
    .select("-isActive -_id")
    .populate({
      path: "lineItems.pants",
      select:
        "-measurements -description -assignedTo -unitOfMeasurement -orderId -_id",
      strictPopulate: false,
    })
    .populate({
      path: "lineItems.shirts",
      select:
        "-measurements -description -assignedTo -unitOfMeasurement -orderId -_id",
      strictPopulate: false,
    });

  if (!response) {
    throw new Error("No Order Found ");
  }

  res.json({
    status: "success",
    data: response,
  });
});

// update a order
exports.updateOrder = catchAsync(async function (req, res, next) {
  delete req.body._id;
  delete req.body.orderNumber;
  delete req.body.orderDate;
  delete req.body.quantity;
  delete req.body.lineItems;
  delete req.body.isActive;
  delete req.body.deliveredDate;

  if (!req.body.status === "delivered") delete req.body.status;
  if (req.body.status === "delivered") {
    req.body.deliveredDate = new Date();
    req.body.isActive = false;
  }

  const response = await Order.findOneAndUpdate(
    { orderNumber: req.params.orderId },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  )
    .populate({
      path: "lineItems.pants",
      strictPopulate: false,
    })
    .populate({
      path: "lineItems.shirts",
      strictPopulate: false,
    });

  if (response.status === "delivered") {
    if (response.lineItems.pants) {
      const pantDate = await Pant.findById(response.lineItems.pants);
      pantDate.isActive = false;
      pantDate.status = "completed";
      pantDate.save();
    }

    if (response.lineItems.shirts) {
      const shirtData = await Shirt.findById(response.lineItems.shirts);
      shirtData.isActive = false;
      shirtData.status = "completed";
      shirtData.save();
    }
  }
  res.json({
    status: "success",
    data: response,
  });
});

exports.getStatistics = catchAsync(async function (req, res, next) {
  if (!req.query.year) {
    throw new Error("Please provide year to get Payments Details");
  }
  if (!req.query.year.length === 4) {
    throw new Error(
      `${req.query.year} is not a valid year , Please Provide Valid one.`
    );
  }

  if (+req.query.year > new Date().getFullYear()) {
    throw new Error("You can't get statistics for future");
  }

  const response = await Order.aggregate([
    {
      $match: {
        orderDate: {
          $gte: new Date(req.query.year),
          $lte: new Date(`${+req.query.year + 1}`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: "$orderDate",
        },
        totalOrders: {
          $sum: "$quantity",
        },
      },
    },
    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: MONTHINSTRING,
            },
            in: {
              $arrayElemAt: ["$$monthsInString", "$_id"],
            },
          },
        },
      },
    },
  ]);

  const data = statisticsDataFormat(response);

  res.json({
    status: "success",
    data,
  });
});
