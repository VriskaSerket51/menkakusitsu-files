import { Response, Request, NextFunction } from "express";
import config from "../config";
import { HttpException } from "../exceptions";

export const defaultModelMiddleware = (authType?: "access") => {
    const middleware: ((
        req: Request,
        res: Response,
        next: NextFunction
    ) => any)[] = [];
    switch (authType) {
        case "access":
            middleware.push((req, res, next) => {
                const bearer = req.headers.authorization;
                if (!bearer || !bearer.startsWith("Bearer ")) {
                    throw new HttpException(401);
                }
                if (bearer.split(" ")[1] != config.authKey) {
                    throw new HttpException(403);
                }
                next();
            });
            break;
        default:
            break;
    }
    return middleware;
};
