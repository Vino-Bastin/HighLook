const express = require("express");

const orderController = require("./../controller/orderController");
const pantController = require("./../controller/pantController");
const shirtController = require("./../controller/shirtController");
const authController = require("../controller/authController");

const orderRouter = express.Router();

// middleware to check user is authenticated
orderRouter.use(authController.isAuthenticated);

orderRouter
  .route("/")
  .get(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.getFilters,
    orderController.getAllOrders
  ) // get all orders
  .post(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.createOrder
  ); // create a order

orderRouter
  .route("/pants")
  .get(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.getFilters,
    pantController.getAllPants
  ); // get all pants
orderRouter
  .route("/shirts")
  .get(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.getFilters,
    shirtController.getAllShirts
  ); // get all shirts

orderRouter
  .route("/:orderId")
  .get(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.isActiveOrder,
    orderController.getOrder
  ) // get order details
  .patch(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.isActiveOrder,
    orderController.updateOrder
  ); // update order details

orderRouter
  .route("/:orderId/pants")
  .get(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.isActiveOrder,
    pantController.getAllPantsForOrder
  ) // get pant details for an order
  .post(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.isActiveOrder,
    pantController.createPant
  ); // create a  pant for an order

orderRouter
  .route("/:orderId/pants/:pantId")
  .get(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.isActiveOrder,
    pantController.getPant
  ) // get a  pant details for an order
  .patch(orderController.isActiveOrder, pantController.updatePant); // update a pant details for an order

orderRouter
  .route("/:orderId/shirts")
  .get(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.isActiveOrder,
    shirtController.getAllShirtsForOrder
  ) // get shirt details for orders
  .post(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.isActiveOrder,
    shirtController.createShirt
  ); // create a shirt for an order

orderRouter
  .route("/:orderId/shirts/:shirtId")
  .get(
    authController.protectRoute("admin", "lead-tailor"),
    orderController.isActiveOrder,
    shirtController.getShirt
  ) // get a shirt for an order
  .patch(orderController.isActiveOrder, shirtController.updateShirt); // update a shirt details for an order

module.exports = orderRouter;
