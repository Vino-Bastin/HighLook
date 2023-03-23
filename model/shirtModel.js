const mongoose = require("mongoose");
const Order = require("./orderModel");

const shirtSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Types.ObjectId,
    required: [true, "A shirt must contain an order ID"],
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
    type: mongoose.Types.ObjectId,
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
      values: ["full-size", "half-size"],
      message:
        "{VALUE} is not allowed and allowed values are (full-size, half-size)",
    },
    default: "half-size",
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
    SO: {
      type: String,
      default: "0",
    },
    SH: {
      type: String,
      default: "0",
    },
    B: {
      type: String,
      default: "0",
    },
    N: {
      type: String,
      default: "0",
    },
    HF: {
      type: String,
      default: "0",
    },
    SL: {
      type: String,
      default: "0",
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

shirtSchema.post("findOneAndUpdate", async function (document) {
  const orderData = await Order.findOne({ _id: document.orderId }).populate({
    path: "lineItems.pants",
    strictPopulate: false,
  });

  if (
    orderData.lineItems.pants &&
    !["preparing", "stitching", "ironing"].includes(document.status)
  ) {
    if (
      ["ordered"].includes(document.status) &&
      ["ordered"].includes(orderData.lineItems.pants.status)
    ) {
      orderData.status = "ordered";
    } else if (
      ["completed"].includes(document.status) &&
      ["completed"].includes(orderData.lineItems.pants.status)
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
    (orderData.lineItems?.pants?.quantity
      ? orderData.lineItems.pants.quantity
      : 0);
  orderData.save();
});

shirtSchema.pre("save", async function () {
  if (this.isModified("quantity")) {
    const response = await Order.findOne({ _id: this.orderId });
    response.lineItems.shirts = this._id;
    response.quantity += this.quantity;
    await response.save();
  }
});

const Shirt = mongoose.model("shirts", shirtSchema);

module.exports = Shirt;
