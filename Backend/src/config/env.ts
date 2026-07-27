const requiredEnvVars = [
    'FRONTEND_URL',
    'DATABASE_URL',
    'SECRET_KEY',
    'REFRESH_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'TEST_ACCESS_TOKEN',
    'WEBHOOK_URL'
] as const

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Variable de entorno faltante: ${envVar}`)
    }
}

export const env = {
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    SECRET_KEY: process.env.SECRET_KEY as string,
    REFRESH_KEY: process.env.REFRESH_KEY as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    TEST_ACCESS_TOKEN: process.env.TEST_ACCESS_TOKEN as string,
    WEBHOOK_URL: process.env.WEBHOOK_URL as string
}