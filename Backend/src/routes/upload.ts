import { Router } from "express";
import { UploadController } from "../controllers/upload.js";
import { VerifyToken } from "../middlewares/verifyToken.js";
import { VerifyAdmin } from "../middlewares/verifyAdmin.js";
import { upload } from "../middlewares/uploadImages.js";

export const uploadRouter: Router = Router();

uploadRouter.post("/", VerifyToken, VerifyAdmin("ADMIN"), upload.single("file"), UploadController.upload);
