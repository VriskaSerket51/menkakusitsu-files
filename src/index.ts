import { App, logger } from "common-api-ts";
import dotenv from "dotenv";
import path from "path";
import config from "./config";
import {
    authRouterMiddleware,
    fileUploadMiddleware,
    staticPathMiddleware,
} from "./middlewares";

dotenv.config();

runExpressApp();

function runExpressApp() {
    const app = new App(
        path.join(__dirname, "router"),
        [staticPathMiddleware, fileUploadMiddleware],
        authRouterMiddleware,
        []
    );
    app.run(
        config.port,
        () => {
            console.info(`Server started with port: ${config.port}`);
        },
        (error) => {
            logger.error(error);
        }
    );
}
