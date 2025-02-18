import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

class Unauthorized extends CustomError {
    constructor(messsage) {
        super(messsage, StatusCodes.UNAUTHORIZED);
    }
}

export default Unauthorized;