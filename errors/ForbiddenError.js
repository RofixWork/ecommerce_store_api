import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

class ForbiddenError extends CustomError {
    constructor(messsage) {
        super(messsage, StatusCodes.FORBIDDEN);
    }
}

export default ForbiddenError;