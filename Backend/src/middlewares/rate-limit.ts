import rateLimit from 'express-rate-limit'

// Login: límite estricto para prevenir fuerza bruta de credenciales
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // ventana de 15 minutos
    max: 5,                      // máximo 5 intentos por IP
    message: { message: 'Demasiados intentos de login, intentá de nuevo en 15 minutos' },
    standardHeaders: true,
    legacyHeaders: false
})

// Register: límite moderado para prevenir spam de creación de cuentas
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,   // ventana de 1 hora
    max: 10,                     // máximo 10 registros por IP
    message: { message: 'Demasiados registros desde esta IP, intentá de nuevo en 1 hora' },
    standardHeaders: true,
    legacyHeaders: false
})

// Refresh: límite más permisivo
export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // ventana de 15 minutos
    max: 30,                     // máximo 30 refrescos por IP
    message: { message: 'Demasiados intentos, intentá de nuevo en 15 minutos' },
    standardHeaders: true,
    legacyHeaders: false
})
