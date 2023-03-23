const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "please provide your FirstName"],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "please provide a email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "please provide a valid email",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "lead-tailor", "tailor", "user"],
      message: "{VALUE} is not supported ",
    },
    default: "user",
  },
  password: {
    type: String,
    required: true,
    minLength: [9, "password must contain at least 9 characters "],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (confirmPassword) {
        return this.password === confirmPassword;
      },
      message: "password and confirmPassword must be same",
    },
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
});

//mongoose middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
    this.confirmPassword = undefined;
    this.passwordChangedAt = Date.now();
  }
  return next();
});

// mongoose global document methods
userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("users", userSchema);

module.exports = User;
