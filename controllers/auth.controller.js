import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import {BadRequest, Unauthorized} from '../errors/index.js'
/**
 * @typedef {import('express').Request} RequestType
 * @typedef {import('express').Response} ResponseType
 */
class AuthController {
  /**
   * Register
   * @param {RequestType} request
   * @param {ResponseType} response
   * @returns {ResponseType}
   */
  static async register(request, response) {
    const { name, email, password } = request.body;
    const user = await User.create({ name, email, password });
    const token = user.createJWT();
    AuthController.#attachCookiesToResponse(response, token);
    return response.status(StatusCodes.CREATED).json({
      user: { id: user.id, name: user.name, role: user.role },
    });
  }
  /**
   * this method for stored token inside cookies
   * @param {ResponseType} response
   * @param {String} token
   * @returns {void}
   */
  static #attachCookiesToResponse(response, token) {
    const cookieLifetime = 1000 * 60 * 60 * 24;
    response.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + cookieLifetime),
      secure: process.env.NODE_ENV === "production",
      signed: true
    });
  }
  /**
   * Login
   * @param {RequestType} request
   * @param {ResponseType} response
   * @returns {ResponseType}
   */
  static async login(request, response) {
    const {email, password} = request.body;
    if(!email?.trim() || !password?.trim()) {
      throw new BadRequest("Email and password are required");
    }
    
    const user = await User.findOne({ email }).select("+password");

    if(!user) {
      throw new Unauthorized("Invalid email or password");
    }
    
    const isPasswordValid = await user.isPasswordValid(password);
    if(!isPasswordValid) {
      throw new Unauthorized("Invalid email or password");
    }

    const token = user.createJWT();
    AuthController.#attachCookiesToResponse(response, token);
    return response.status(StatusCodes.OK).json({
      user: { id: user.id, name: user.name, role: user.role },
    });
  }

  /**
   * LOgout
   * @param {RequestType} request
   * @param {ResponseType} response
   * @returns {ResponseType}
   */
  static async logout(request, response) {
    return response.send("logout");
  }
}

export default AuthController;
