import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Request, Response } from "express";
import { prisma } from "../../db";

const required = ["R2_ACCESS_KEY_ID", "R2_ACCESS_SECRET_KEY", "R2_ENDPOINT", "R2_PUBLIC_URL", "R2_BUCKET"];
for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing env variable: ${key}`);
}

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_ACCESS_SECRET_KEY = process.env.R2_ACCESS_SECRET_KEY!;
const R2_ENDPOINT = process.env.R2_ENDPOINT!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
const R2_BUCKET = process.env.R2_BUCKET!;

const s3Client = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_ACCESS_SECRET_KEY,
    },
});

function getFileExtension(fileName: string): string {
    const parts = fileName.split(".");
    const extension = parts[parts.length - 1];
    return extension && extension !== fileName ? extension : "bin";
}

export async function food(req: Request, res: Response) {
    const { fileName, fileType } = req.body ?? {};

    if (!fileName || !fileType)
        return res.status(400).json({ error: "fileName and fileType are required" });

    if (!fileType.startsWith("video/"))
        return res.status(400).json({ error: "Only video uploads are allowed" });

    const extension = getFileExtension(fileName);
    const key = `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            ContentType: fileType,
            // ContentDisposition: "attachment", downloads the file on system when url is hit
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        const publicUrl = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;

        res.json({ signedUrl, key, publicUrl });
    } catch (error) {
        console.error("Failed to generate presigned URL:", error);
        res.status(500).json({ error: "Failed to generate URL" });
    }
}

export async function saveVideo(req: Request, res: Response) {
    const { videoUrl, title, description } = req.body;
    const foodPartner = (req as any).foodPartner;

    if (!videoUrl || !title || !description) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const foodVid = await prisma.foodVids.create({
            data: {
                videoUrl,
                title,
                description,
                foodPartnerId: foodPartner.id
            }
        });
        res.status(201).json(foodVid);
    } catch (error) {
        console.error("Failed to save video:", error);
        res.status(500).json({ error: "Failed to save video" });
    }
}

export async function getVideos(req: Request, res: Response) {
    try {
        const videos = await prisma.foodVids.findMany({
            include: {
                foodPartner: {
                    select: {
                        name: true
                    }
                }
            }
        });
        
        // Map database records to frontend Reel type
        const reels = videos.map(vid => ({
            id: vid.id,
            videoUrl: vid.videoUrl,
            title: vid.title,
            description: vid.description,
            partnerName: vid.foodPartner?.name || "Unknown Partner",
            likes: 0,
            isLiked: false,
            isSaved: false,
            createdAt: new Date().toISOString()
        }));

        res.json(reels);
    } catch (error) {
        console.error("Failed to fetch videos:", error);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
}
