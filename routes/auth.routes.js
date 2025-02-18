import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
const authRouter = Router();

authRouter
  .get("/logout", AuthController.logout)
  .post("/register", AuthController.register)
  .post("/login", AuthController.login);

export default authRouter;
