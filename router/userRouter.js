const express = require("express");
const orderController = require("./../controller/orderController");
const authController = require("./../controller/authController");
const userController = require("./../controller/userController");

const userRouter = express.Router();

// to create a new tailor
userRouter
  .route("/signup")
  .post(
    authController.isAuthenticated,
    authController.protectRoute("admin"),
    authController.signup
  );

// login route
userRouter.route("/login").post(authController.login);

// logout route
userRouter
  .route("/logout")
  .post(authController.isAuthenticated, authController.logout);

// Password reset Mail route
userRouter
  .route("/send-password-reset-mail")
  .post(authController.sendPasswordResetMail);

// Password Reset route
userRouter.route("/password-reset").post(authController.resetPassword);

// to check whether tailor having a valid session route
userRouter
  .route("/auth")
  .post(authController.isAuthenticated, authController.auth);

// get all tailors details and  update user details routes
userRouter
  .route("/user")
  .get(authController.isAuthenticated, userController.getAllUsers)
  .patch(authController.isAuthenticated, userController.updateUserDetails);

// get works for tailor routes
userRouter
  .route("/my-work")
  .get(
    authController.isAuthenticated,
    orderController.getFilters,
    userController.getMyWork
  );

// get payment details for tailors route
userRouter
  .route("/payments")
  .get(
    authController.isAuthenticated,
    authController.protectRoute("admin"),
    userController.getPaymentDetails
  );

// get statistics route
userRouter
  .route("/statistics")
  .get(
    authController.isAuthenticated,
    authController.protectRoute("admin"),
    orderController.getStatistics
  );

// get order status route
userRouter.route("/orders/status/:orderId").get(orderController.status);

module.exports = userRouter;
