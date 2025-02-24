import { Router } from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication.js";
import OrderController from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter
  .route("/")
  .get([authenticateUser, authorizePermissions("admin")], OrderController.all)
  .post(authenticateUser, OrderController.create);
orderRouter.route("/show-all-my-orders").get(authenticateUser, OrderController.get_user_orders);
orderRouter
  .route("/:id")
  .get(authenticateUser, OrderController.get)
  .patch(authenticateUser, OrderController.update);
export default orderRouter;
