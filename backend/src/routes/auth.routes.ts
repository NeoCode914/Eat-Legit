import { Router } from "express";
import { authController } from "../controllers/auth.controller";

export const authRouter = Router();

//user routes
authRouter.post("/user/register", authController.register);
authRouter.post("/user/login", authController.login);
authRouter.get("/user/logout", authController.logout);

//food-partner routes
authRouter.post("/food-partner/register", authController.foodPartnerRegister);
authRouter.post("/food-partner/login", authController.foodPartnerLogin);
authRouter.get("/food-partner/logout", authController.foodPartnerLogout);
