import { Router, Request, Response, NextFunction } from "express";
import config from "../config";
import { HttpException } from "../exceptions";
import { defaultErrorHandler } from "../utils/ErrorHandler";
import { readAllFiles } from "../utils/Utility";
import { RouterBase } from "./RouterBase";

const authMiddleware = (authType?: "access") => {
    const middleware: ((
        req: Request,
        res: Response,
        next: NextFunction
    ) => any)[] = [];
    switch (authType) {
        case "access":
            middleware.push((req, res, next) => {
                try {
                    const bearer = req.headers.authorization;
                    if (!bearer || !bearer.startsWith("Bearer ")) {
                        throw new HttpException(401);
                    }
                    if (bearer.split(" ")[1] != config.authKey) {
                        throw new HttpException(403);
                    }
                    next();
                } catch (error) {
                    defaultErrorHandler(res, error);
                }
            });
            break;
        default:
            break;
    }
    return middleware;
};

const createDefaultRouter = (): Router => {
    const defaultRouter = Router();

    const fileNames: string[] = [];
    readAllFiles(__dirname, fileNames, (fileName) =>
        fileName.startsWith("index")
    );

    fileNames.forEach((fileName) => {
        const module = require(fileName).default;
        if (!module || !(module.prototype instanceof RouterBase)) {
            return;
        }
        const subrouter: RouterBase = new module();

        const router = Router();
        subrouter.models.forEach((model) => {
            router[model.method](
                model.path,
                ...authMiddleware(model.authType),
                model.controller
            );
        });
        defaultRouter.use(subrouter.path, router);
    });

    return defaultRouter;
};

export const defaultRouter = createDefaultRouter();
