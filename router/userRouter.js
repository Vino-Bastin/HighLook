const express = require("express");
const orderController = require("./../controller/orderController");
const authController = require("./../controller/authController");
const userController = require("./../controller/userController");

const userRouter = express.Router();

userRouter
  .route("/signup")
  .post(
    authController.isAuthenticated,
    authController.protectRoute("admin"),
    authController.signup
  ); // to create a new tailor
userRouter.route("/login").post(authController.login); // login
userRouter
  .route("/logout")
  .post(authController.isAuthenticated, authController.logout); //logout

userRouter
  .route("/auth")
  .post(authController.isAuthenticated, authController.auth); // to check whether tailor having a valid session

userRouter
  .route("/user")
  .get(authController.isAuthenticated, userController.getAllUsers) // get all tailors details
  .patch(authController.isAuthenticated, userController.updateUserDetails); // update tailor details

userRouter
  .route("/my-work")
  .get(
    authController.isAuthenticated,
    orderController.getFilters,
    userController.getMyWork
  ); // get works for tailor

userRouter
  .route("/payments")
  .get(
    authController.isAuthenticated,
    authController.protectRoute("admin"),
    userController.getPaymentDetails
  ); //get payment details for tailors

userRouter
  .route("/statistics")
  .get(
    authController.isAuthenticated,
    authController.protectRoute("admin"),
    orderController.getStatistics
  );

userRouter.route("/orders/status/:orderId").get(orderController.status); // get order status for a order

module.exports = userRouter;
