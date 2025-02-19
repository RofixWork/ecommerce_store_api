import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route('/').get(UserController.all);

userRouter.route('/show-me').get(UserController.current);
userRouter.route('/:id').get(UserController.get);

userRouter.route('/update-user').patch(UserController.update_user);
userRouter.route('/update-user-password').patch(UserController.update_user_password);


export default userRouter;