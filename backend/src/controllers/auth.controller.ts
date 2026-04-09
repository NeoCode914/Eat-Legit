import type { Request, Response } from "express";
import { registerModel, loginModel } from "../ZodModels/userModel";
import { prisma } from "../../db";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PartnerLoginModel, PartnerRegisterModel } from "../ZodModels/foodPartnerModels";
import { secret } from "../app";

export const authController = {
    register,
    login,
    logout,
    foodPartnerRegister,
    foodPartnerLogin,
    foodPartnerLogout
}

async function register(req: Request, res: Response) {
    try {
        const { success, data, error } = registerModel.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "invalid inputs"
            })
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const hash = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hash
            }
        });
        const token = jwt.sign({ userId: user.id }, secret);
        res.cookie("token", token);
        res.status(201).json({
            message: "user registerd successfully",
            token,
            user: {
                userId: user.id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.log(error);
    }
}

async function login(req: Request, res: Response) {
    try {
        const { success, data, error } = loginModel.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "invalid inputs"
            })
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (!existingUser) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const verifyPass = await bcrypt.compare(data.password, existingUser.password);
        if (!verifyPass) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
        const token = jwt.sign({ userId: existingUser.id }, secret);
        res.cookie("token", token);
        res.status(201).json({
            message: "user logged in successfully",
            token,
            user: {
                userId: existingUser.id,
                username: existingUser.username,
                email: existingUser.email
            }
        })
    } catch (error) {
        console.log(error);
    }
}

async function logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.status(200).json({
        message: "user logged out successfully"
    })
}

async function foodPartnerRegister(req: Request, res: Response) {
    try {
        const { success, data, error } = PartnerRegisterModel.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "invalid inputs"
            })
        }
        const existingPartner = await prisma.foodPartner.findUnique({
            where: {
                email: data.email
            }
        })
        if (existingPartner) {
            return res.status(400).json({
                message: "Partner already exists"
            })
        }
        const hash = await bcrypt.hash(data.password, 10);
        const foodPartner = await prisma.foodPartner.create({
            data: {
                name: data.name,
                email: data.email,
                password: hash
            }
        });
        const token = jwt.sign({ foodPartnerId: foodPartner.id }, secret);
        res.cookie("token", token);
        res.status(201).json({
            message: "Partner registerd successfully",
            token,
            user: {
                foodPartnerId: foodPartner.id,
                name: foodPartner.name,
                email: foodPartner.email
            }
        })
    } catch (error) {
        res.json(error);
    }
}

async function foodPartnerLogin(req: Request, res: Response) {
    try {
        const { success, data, error } = PartnerLoginModel.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "invalid inputs"
            })
        }
        const existingPartner = await prisma.foodPartner.findUnique({
            where: {
                email: data.email
            }
        })
        if (!existingPartner) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const verifyPass = await bcrypt.compare(data.password, existingPartner.password);
        if (!verifyPass) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
        const token = jwt.sign({ foodPartnerId: existingPartner.id }, secret);
        res.cookie("token", token);
        res.status(201).json({
            message: "Partner logged in successfully",
            token,
            user: {
                foodPartnerId: existingPartner.id,
                name: existingPartner.name,
                email: existingPartner.email
            }
        })
    } catch (error) {
        res.json(error);
    }
}

async function foodPartnerLogout(req: Request, res: Response) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Partner logged out successfully"
    })
}