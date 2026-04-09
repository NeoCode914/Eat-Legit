import { Router } from "express";
import { food, saveVideo, getVideos } from "../controllers/food.controller";
import authMiddleware from "../middlewares/auth.middleware";

export const foodRouter = Router();

foodRouter.get("/videos", getVideos);
foodRouter.post("/", authMiddleware.foodPartnerMiddleware, food);
foodRouter.post("/video", authMiddleware.foodPartnerMiddleware, saveVideo);