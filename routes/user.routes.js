import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import {authenticateUser, authorizePermissions} from "../middlewares/authentication.js";

const userRouter = Router();

userRouter.route('/').get([authenticateUser, authorizePermissions('admin')], UserController.all);

userRouter.route('/show-me').get(authenticateUser, UserController.current);
userRouter.route('/:id').get([authenticateUser, authorizePermissions('admin')], UserController.get);

userRouter.route('/update-user').patch(authenticateUser, UserController.update_user);
userRouter.route('/update-user-password').patch(authenticateUser, UserController.update_user_password);


export default userRouter;