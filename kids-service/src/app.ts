import express, { Express } from "express";
import userRouter from "./routes/kidsRoutes";
import { errorConverter, errorHandler } from "./middleware";
import cookieParser from "cookie-parser";

const app: Express = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(errorConverter);
app.use(errorHandler);

export default app;