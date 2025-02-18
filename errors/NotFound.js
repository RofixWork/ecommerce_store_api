import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

class NotFound extends CustomError {
    constructor(messsage) {
        super(messsage, StatusCodes.NOT_FOUND);
    }
}

export default NotFound;