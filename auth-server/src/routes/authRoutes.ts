import { Router } from "express";
import AuthController from "../controllers/AuthController";

const userRouter = Router();

userRouter.post("/register", AuthController.register);
userRouter.post("/login", AuthController.login);
userRouter.get("/current-user", AuthController.currentUser);
userRouter.post("/logout", AuthController.logout);

export default userRouter;
