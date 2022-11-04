import { RouterBase } from "../RouterBase";
import e, { Request, Response } from "express";
import { HttpException } from "../../exceptions";
import { defaultErrorHandler } from "../../utils/ErrorHandler";
import { UploadedFile } from "express-fileupload";
import path from "path";

class Files extends RouterBase {
    constructor() {
        super();
        this.setPath("/files");
        this.models = [
            {
                method: "post",
                path: "/upload",
                authType: "access",
                controller: Files.PostFile,
            },
        ];
    }

    static async PostFile(req: Request, res: Response) {
        try {
            if (!req.files) {
                throw new HttpException(400);
            }
            const data = req.files.data;
            if (!data) {
                throw new HttpException(400);
            }
            const handleFile = (file: UploadedFile) => {
                const fileName = file.name;
                file.mv(
                    path.join(__dirname, "..", "..", "..", "public", fileName)
                );
            };

            if (Array.isArray(data)) {
                for (const file of data) {
                    handleFile(file);
                }
            } else {
                handleFile(data);
            }

            res.sendStatus(200)
        } catch (error) {
            defaultErrorHandler(res, error);
        }
    }
}

export default Files;