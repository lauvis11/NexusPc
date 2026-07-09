const requiredEnvVars = [
    'DATABASE_URL',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET'
] as const

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Variable de entorno faltante: ${envVar}`)
    }
}

export const env = {
    DATABASE_URL: process.env.DATABASE_URL as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string
}