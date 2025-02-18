import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";

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
    const {name, email, password} = request.body;
    const user = await User.create({name, email, password});
    const token = user.createJWT();
    return response.status(StatusCodes.CREATED).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  }
  /**
   * Login
   * @param {RequestType} request
   * @param {ResponseType} response
   * @returns {ResponseType}
   */
  static async login(request, response) {
    return response.send("login");
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
