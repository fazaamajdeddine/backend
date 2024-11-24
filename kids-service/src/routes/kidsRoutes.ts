import { Router } from "express";
import KidsController from "../controllers/KidsController";
import { authMiddleware } from "../middleware";

const kidsRoutes = Router();

// @ts-ignore
kidsRoutes.post("/add", authMiddleware, KidsController.addKid);
// @ts-ignore
kidsRoutes.put("/update/:kidId", authMiddleware, KidsController.updateKid);
// @ts-ignore
kidsRoutes.get("/get-kids", authMiddleware, KidsController.getKids);
// @ts-ignore
kidsRoutes.delete("/delete/:kidId", authMiddleware, KidsController.deleteKid);

export default kidsRoutes;
