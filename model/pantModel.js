const mongoose = require("mongoose");

const Order = require("./orderModel");

const pantSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "A pant must contain an order ID"],
    ref: "orders",
  },
  orderNumber: {
    type: Number,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  unitOfMeasurement: {
    type: String,
    enum: {
      values: ["inch", "cm"],
      message: '{VALUE} is not allowed and allowed values are ("inch", "cm")',
    },
    default: "inch",
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  status: {
    type: String,
    enum: {
      values: ["ordered", "preparing", "stitching", "ironing", "completed"],
      message:
        "{VALUE} is not allowed , allowed values are (ordered, preparing, stitching, ironing, completed)",
    },
    default: "ordered",
  },
  type: {
    type: String,
    enum: {
      values: ["full-size", "half-size", "3/4-size"],
      message:
        "{VALUE} is not allowed and allowed values are (full-size, half-size, 3/4-size)",
    },
  },
  description: String,
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  measurements: {
    H: {
      type: String,
      default: "0",
    },
    W: {
      type: String,
      default: "0",
    },
    S: {
      type: String,
      default: "0",
    },
    F: {
      type: String,
      default: "0",
    },
    D: {
      type: String,
      default: "0",
    },
    HL: {
      type: String,
      default: "0",
    },
    B: {
      type: String,
      default: "0",
    },
    IN: {
      type: String,
      default: "0",
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

pantSchema.post("findOneAndUpdate", async function (document) {
  const orderData = await Order.findOne({ _id: document.orderId }).populate({
    path: "lineItems.shirts",
    strictPopulate: false,
  });

  if (
    orderData.lineItems.shirts &&
    !["preparing", "stitching", "ironing"].includes(document.status)
  ) {
    if (
      ["ordered"].includes(document.status) &&
      ["ordered"].includes(orderData.lineItems.shirts.status)
    ) {
      orderData.status = "ordered";
    } else if (
      ["completed"].includes(document.status) &&
      ["completed"].includes(orderData.lineItems.shirts.status)
    ) {
      orderData.status = "ready";
    }
  } else if (["preparing", "stitching", "ironing"].includes(document.status)) {
    orderData.status = "preparing";
  } else if (["completed"].includes(document.status)) {
    orderData.status = "ready";
  } else if (["ordered"].includes(document.status)) {
    orderData.status = "ordered";
  }

  orderData.quantity =
    document.quantity +
    (orderData.lineItems?.shirts?.quantity
      ? orderData.lineItems.shirts.quantity
      : 0);
  orderData.save();
});

pantSchema.pre("save", async function () {
  if (this.isModified("quantity")) {
    console.log("here");
    const response = await Order.findOne({ _id: this.orderId });
    response.lineItems.pants = this._id;
    response.quantity += this.quantity;
    await response.save();
  }
});

const Pant = mongoose.model("pants", pantSchema);

module.exports = Pant;
