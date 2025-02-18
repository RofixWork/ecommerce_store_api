import { StatusCodes } from "http-status-codes"

/**
 * Description
 * @param {Error} error
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 * @returns {import("express").Response}
 */
const errorHnadlerMiddleware = (error, request, response, next) => {
    let customError = {
        statusCode: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: error.message || "Something went wrong, please try again...",
        timestamp: new Date().toISOString()
    }

    if(error.code && error.code === 11000) {
        customError.msg = `Duplicate value entered ${Object.keys(error['keyValue'])}, please enter another value...`;
        customError.statusCode = StatusCodes.CONFLICT;
    }

    if(error.name === 'ValidationError') {        
        customError.msg = Object.values(error.errors).map(e => e.message);
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if(error.name === 'CastError') {
        
        customError.msg = `Invalid ${JSON.stringify(error.value)} id, please provide a valid id...`;
        customError.statusCode = StatusCodes.NOT_FOUND;
    }
    return response.status(customError.statusCode).json({msg: customError})
}

export default errorHnadlerMiddleware;