const express = require("express");

const orderController = require("./../controller/orderController");
const pantController = require("./../controller/pantController");
const shirtController = require("./../controller/shirtController");
const authController = require("../controller/authController");

const orderRouter = express.Router();

orderRouter.use(
  authController.isAuthenticated,
  authController.protectRoute("admin", "lead-tailor")
);

orderRouter
  .route("/")
  .get(orderController.getFilters, orderController.getAllOrders) // get all orders
  .post(orderController.createOrder); // create a order

orderRouter
  .route("/pants")
  .get(orderController.getFilters, pantController.getAllPants); // get all pants
orderRouter
  .route("/shirts")
  .get(orderController.getFilters, shirtController.getAllShirts); // get all shirts

orderRouter
  .route("/:orderId")
  .get(orderController.isActiveOrder, orderController.getOrder) // get order details
  .patch(orderController.isActiveOrder, orderController.updateOrder); // update order details

orderRouter
  .route("/:orderId/pants")
  .get(orderController.isActiveOrder, pantController.getAllPantsForOrder) // get pant details for an order
  .post(orderController.isActiveOrder, pantController.createPant); // create a  pant for an order

orderRouter
  .route("/:orderId/pants/:pantId")
  .get(orderController.isActiveOrder, pantController.getPant) // get a  pant details for an order
  .patch(orderController.isActiveOrder, pantController.updatePant); // update a pant details for an order

orderRouter
  .route("/:orderId/shirts")
  .get(orderController.isActiveOrder, shirtController.getAllShirtsForOrder) // get shirt details for orders
  .post(orderController.isActiveOrder, shirtController.createShirt); // create a shirt for an order

orderRouter
  .route("/:orderId/shirts/:shirtId")
  .get(orderController.isActiveOrder, shirtController.getShirt) // get a shirt for an order
  .patch(orderController.isActiveOrder, shirtController.updateShirt); // update a shirt details for an order

module.exports = orderRouter;
