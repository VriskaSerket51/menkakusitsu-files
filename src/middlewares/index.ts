import { HttpException, Middleware, ModelBase } from "common-api-ts";
import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import config from "../config";

const cacheTime = 86400000 * 30;
export const staticPathMiddleware = express.static(
    path.join(__dirname, "..", "..", "public"),
    {
        maxAge: cacheTime,
    }
);

export const fileUploadMiddleware = fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
});

export const authRouterMiddleware = (model: ModelBase) => {
    const { authType } = model;

    const middleware: Middleware[] = [];
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
