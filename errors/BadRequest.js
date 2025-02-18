import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

class BadRequest extends CustomError {
    constructor(messsage) {
        super(messsage, StatusCodes.BAD_REQUEST);
    }
}

export default BadRequest;