import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary.js";

export class UploadController {
    static async upload(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) return res.status(400).json({ message: "No se recibió ningún archivo." });

            const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "ecommerce" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as { secure_url: string; public_id: string });
                    }
                );
                stream.end(req.file!.buffer);
            });

            return res.status(200).json({
                url: result.secure_url,
                public_id: result.public_id
            });
        } catch (err) {
            return next(err);
        }
    }
}
