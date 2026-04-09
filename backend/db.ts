import "dotenv/config"
import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Use WebSocket for Node.js/Bun environments
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });