import { Router } from "express";
import ReviewController from "../controllers/review.controller.js";
import { authenticateUser } from "../middlewares/authentication.js";

const reviewRouter = Router();

reviewRouter
  .route("/")
  .get(ReviewController.all)
  .post(authenticateUser, ReviewController.create);

reviewRouter
  .route("/:id")
  .get(ReviewController.get)
  .patch(authenticateUser, ReviewController.update)
  .delete(authenticateUser, ReviewController.delete);

export default reviewRouter;
