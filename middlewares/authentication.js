import jwt from "jsonwebtoken";
import { Unauthorized, ForbiddenError } from "../errors/index.js";
/**
 * Description
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 * @returns {import("express").Response}
 */
const authenticateUser = (request, response, next) => {
  const { token } = request.signedCookies;
  if (!token) {
    throw new Unauthorized("Invalid token");
  }

  try {
    const { id, name, role } = jwt.verify(token, process.env.JWT_SECRET);
    request.user = { id, name, role };
    next();
  } catch (error) {
    throw new Unauthorized("Invalid token");
  }
};

const authorizePermissions = (...roles) => {
  /**
   * Description
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   * @returns {import("express").Response}
   */
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      throw new ForbiddenError("Unauthorized to perform this action"); // 403 Forbidden - The request was valid, but the server is refusing to fulfill it.
    }
    next();
  };
};
export { authenticateUser, authorizePermissions };
