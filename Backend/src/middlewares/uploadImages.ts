import multer from "multer";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 5 * 1024 * 1024; // 5MB

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Formato de imagen no permitido. Solo se aceptan JPEG, PNG y WEBP."));
    }
};

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: maxSize,
        files: 1,
        fields: 0
    },
    fileFilter,
});
