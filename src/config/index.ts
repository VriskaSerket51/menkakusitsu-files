import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV === "production") {
    dotenv.config({
        path: path.join(__dirname, "..", "..", ".env.production"),
    });
} else if (process.env.NODE_ENV === "development") {
    dotenv.config({
        path: path.join(__dirname, "..", "..", ".env.development"),
    });
} else {
    throw new Error("no process.env.NODE_ENV");
}

export default {
    port: Number(process.env.PORT!),
    authKey: process.env.AUTH_KEY!,
};
