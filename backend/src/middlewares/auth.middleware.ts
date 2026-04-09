import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret } from "../app";
import { prisma } from "../../db";

interface CustomJwtPayload {
    foodPartnerId: string;
}

const authMiddleware = {
    foodPartnerMiddleware,
};

export default authMiddleware;

async function foodPartnerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
        return res.status(401).json({
            message: "Please login first",
        });
    }

    try {
        const decoded = jwt.verify(token, secret) as CustomJwtPayload;

        const foodPartner = await prisma.foodPartner.findUniqueOrThrow({
            where: {
                id: decoded.foodPartnerId,
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        req.foodPartner = foodPartner;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}