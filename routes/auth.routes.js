import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/authentication.js";
const authRouter = Router();

authRouter
.post("/register", AuthController.register)
.post("/login", AuthController.login)
.get("/logout", authenticateUser, AuthController.logout);

export default authRouter;
