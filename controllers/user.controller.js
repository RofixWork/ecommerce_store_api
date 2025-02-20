import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes';
import {NotFound, BadRequest} from '../errors/index.js';
import AuthController from './auth.controller.js';
class UserController {
    /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {import('express').Response}
     */
    static async all(request, response) {
        const users = await User.find({role:'user'});

        return response.status(StatusCodes.OK).json({nbHits: users.length, users});
    }

     /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {import('express').Response}
     */
     static async get(request, response) {
        console.log(request.user);
        
        const {id: userId} = request.params;
        const user = await User.findById(userId);
        if(!user) {
            throw new NotFound("User not found"); 
        }
        return response.status(StatusCodes.OK).json(user);
    }

     /** my account
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {import('express').Response}
     */
     static async current(request, response) {
        return response.status(StatusCodes.OK).send({user: request.user});
    }

     /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {import('express').Response}
     */
     static async update_user(request, response) {
        const {id: userId} = request.user;
        const {name, email} = request.body;
        if(!name?.trim() || !email?.trim()) {
            throw new BadRequest("Name and email are required");
        }

        const user = await User.findByIdAndUpdate(userId, request.body, {runValidators:true, new:true});

        const token = user.createJWT()
        AuthController.attachCookiesToResponse(response, token);
        // ?message success
        response.status(StatusCodes.OK).json({msg: "Updated Successfully"});

    }

     /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {import('express').Response}
     */
     static async update_user_password(request, response) {
        console.log('here');
        
        const {id: userId} = request.user;
        const {old_password, new_password} = request.body;
        console.log(request.user);

        if(!old_password?.trim() || !new_password?.trim()) {
            throw new BadRequest("Old and new password are required");
        }

        if(new_password?.length < 8) {
            throw new BadRequest("Minimum 8 characters required for new password");
        }
        const user = await User.findById(userId).select("+password");

        if(!user) {
            throw new NotFound("User not found");
        }
        
        //check old password
        const isPasswordValid = await user.isPasswordValid(old_password);
        if(!isPasswordValid) {
            throw new BadRequest("Invalid old password");
        }

        user.password = new_password;
        await user.save();

        response.clearCookie("token", {
            httpOnly: true,
            signed: true,
            secure: process.env.NODE_ENV === "production",
          });

        return response.status(StatusCodes.OK).json({msg: "Password updated successfully, please login again..."});
    }
}

export default UserController;