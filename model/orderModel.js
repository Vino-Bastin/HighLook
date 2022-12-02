const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderNumber: {
    unique: true,
    type: String,
    default: Date.now(),
  },
  orderDate: {
    type: Date,
    default: new Date(),
  },
  deliveredDate: {
    type: Date,
  },
  schoolName: String,
  standard: String,
  name: {
    type: String,
    required: [true, " please provide a name for order"],
  },
  mobileNumber: {
    type: Number,
    required: [true, "please provide mobile number for order"],
    validate: {
      validator: function (mobileNumber) {
        return `${mobileNumber}`.length === 10;
      },
      message: "Mobile Number must have 10 numbers",
    },
  },
  status: {
    type: String,
    enum: {
      values: ["ordered", "preparing", "ready", "delivered"],
      message:
        "{VALUE} is not allowed and allowed  values are (ordered, preparing, ready,delivered)",
    },
    default: "ordered",
  },
  quantity: {
    type: Number,
    default: 0,
  },
  lineItems: {
    pants: {
      type: mongoose.Schema.ObjectId,
      ref: "pants",
    },
    shirts: {
      type: mongoose.Schema.ObjectId,
      ref: "shirts",
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
