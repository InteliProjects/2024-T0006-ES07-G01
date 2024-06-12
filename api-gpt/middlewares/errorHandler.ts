import { Request, Response, NextFunction } from "express";

function returnStatusCode(type: string) {
    if (type === "Conflict") return 409;

    if (type === "Unauthorized") return 401;

    if (type === "NotFound") return 404;

    return 500;
}

export default function errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = returnStatusCode(error.type);
    const message = error.message || "Internal server error";

    return res.status(statusCode).send(message);
}
