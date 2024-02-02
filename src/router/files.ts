import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";
import CommonApi from "@ireves/common-api";

class Files extends CommonApi.RouterBase {
  constructor() {
    super();
    this.setPath("/files");
    this.models = [
      {
        method: "post",
        path: "/upload",
        authType: "access",
        controller: this.onPostFile,
      },
    ];
  }

  async onPostFile(req: Request, res: Response) {
    if (!req.files) {
      throw new CommonApi.HttpException(400);
    }
    const data = req.files.data;
    if (!data) {
      throw new CommonApi.HttpException(400);
    }
    const handleFile = (file: UploadedFile) => {
      const dir = path.join(__dirname, "..", "..", "..", "public");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const fileName = file.name;
      file.mv(path.join(__dirname, "..", "..", "..", "public", fileName));
    };

    if (Array.isArray(data)) {
      for (const file of data) {
        handleFile(file);
      }
    } else {
      handleFile(data);
    }

    res.sendStatus(200);
  }
}

export default Files;
