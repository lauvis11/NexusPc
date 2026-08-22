import { z } from "zod";

/**
 * Esquema de validación y sanitización para datos de facturación y entrega.
 * Protege contra inyecciones de datos maliciosos, cadenas vacías y formatos inválidos.
 */
export const datosFacturacionSchema = z.object({
  nombre_completo: z
    .string()
    .trim()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]+$/,
      "El nombre solo puede contener letras y caracteres válidos"
    ),
  dni: z
    .string()
    .trim()
    .regex(/^\d{7,9}$/, "El DNI debe contener entre 7 y 9 dígitos numéricos"),
  direccion: z
    .string()
    .trim()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(150, "La dirección no puede exceder 150 caracteres"),
  ciudad: z
    .string()
    .trim()
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "La ciudad no puede exceder 100 caracteres"),
  provincia: z
    .string()
    .trim()
    .min(2, "Por favor seleccioná una provincia")
    .max(100, "La provincia seleccionada no es válida"),
  codigo_postal: z
    .string()
    .trim()
    .min(4, "El código postal debe tener al menos 4 caracteres")
    .max(10, "El código postal no puede exceder 10 caracteres")
    .regex(
      /^[a-zA-Z0-9\s]{4,10}$/,
      "El código postal solo puede contener letras, números y espacios"
    ),
});

/**
 * Esquema para actualización de datos de facturación existentes (el DNI no se modifica).
 */
export const actualizarDatosFacturacionSchema = datosFacturacionSchema.omit({
  dni: true,
});

export type DatosFacturacionInput = z.infer<typeof datosFacturacionSchema>;
export type ActualizarDatosFacturacionInput = z.infer<typeof actualizarDatosFacturacionSchema>;
