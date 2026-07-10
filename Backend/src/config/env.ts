const requiredEnvVars = [
    'DATABASE_URL',
    'SECRET_KEY',
    'REFRESH_KEY'
] as const

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Variable de entorno faltante: ${envVar}`)
    }
}

export const env = {
    DATABASE_URL: process.env.DATABASE_URL as string,
    SECRET_KEY: process.env.SECRET_KEY as string,
    REFRESH_KEY: process.env.REFRESH_KEY as string
}