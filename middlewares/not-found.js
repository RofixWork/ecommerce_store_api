import { StatusCodes } from "http-status-codes";
const notFoundMiddleware = (request, response) => {
    const url = `'${request.url}'`;
    return response.status(StatusCodes.NOT_FOUND).json({
        message: `Route '${request.url}' Not Found`,
        status: StatusCodes.NOT_FOUND,
        timestamp: new Date().toISOString()
    })
}

export default notFoundMiddleware;