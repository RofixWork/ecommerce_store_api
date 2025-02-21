import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import { authenticateUser, authorizePermissions } from "../middlewares/authentication.js";

const productRouter = Router();

const authMiddlewares = [authenticateUser, authorizePermissions('admin')]


productRouter
  .route("/")
  .get(ProductController.all)
  .post(authMiddlewares, ProductController.create);


productRouter.route('/upload-image').post(authMiddlewares, ProductController.uploadImage);

productRouter
  .route("/:id")
  .get(ProductController.get)
  .patch(authMiddlewares, ProductController.update)
  .delete(authMiddlewares, ProductController.delete);

export default productRouter;
