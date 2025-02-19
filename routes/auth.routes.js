import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
const authRouter = Router();

authRouter
.post("/register", AuthController.register)
.post("/login", AuthController.login)
.get("/logout", AuthController.logout);

export default authRouter;
