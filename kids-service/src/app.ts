import express, { Express } from "express";
import userRouter from "./routes/kidsRoutes";
import { errorConverter, errorHandler } from "./middleware";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import CORS

const app: Express = express();
// CORS Configuration
const corsOptions = {
    origin: "http://localhost:5173", // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Enable cookies if required
};
app.use(cors(corsOptions)); // Apply CORS middleware

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(errorConverter);
app.use(errorHandler);

export default app;