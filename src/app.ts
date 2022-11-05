import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import fileUpload from "express-fileupload";
import { defaultRouter } from "./router";

class App {
    expressApp: express.Application;

    constructor() {
        this.expressApp = express();
        this.initMiddlewares();
        this.initRouters();
        this.initSocket();
    }

    run(
        port: number,
        onSuccessed: () => void,
        onFailed: (...args: any[]) => void
    ) {
        this.expressApp.listen(port, onSuccessed).on("error", onFailed);
    }

    initMiddlewares() {
        const cacheTime = 86400000 * 30;
        this.expressApp.use(
            express.static(path.join(__dirname, "..", "public"), {
                maxAge: cacheTime,
            })
        );
        this.expressApp.use(helmet());
        this.expressApp.use(cors());
        this.expressApp.use(
            fileUpload({
                limits: { fileSize: 50 * 1024 * 1024 },
            })
        );
    }

    initRouters() {
        this.expressApp.use("/", defaultRouter);
    }

    initSocket() {}
}

export default App;
