export interface MercadoPagoDemoConfig {
  isDemoMode: boolean;
  buyerAccount: {
    nombre: string;
    email: string;
    password: string;
    codigoVerificacion?: string;
  };
  testCard: {
    numero: string;
    fechaVencimiento: string;
    cvc: string;
    titular: string;
    tipo: string;
  };
  docUrl: string;
}

export const MERCADO_PAGO_DEMO_CONFIG: MercadoPagoDemoConfig = {
  isDemoMode: true,
  buyerAccount: {
    nombre: "Cuenta de prueba publica",
    email: process.env.NEXT_PUBLIC_MP_TEST_USER_EMAIL || "TESTUSER9137987327694958465",
    password: process.env.NEXT_PUBLIC_MP_TEST_USER_PASSWORD || "mlh6QS2u1c",
    codigoVerificacion: process.env.NEXT_PUBLIC_MP_TEST_USER_CODE || "962818",
  },
  testCard: {
    numero: "4242 4242 4242 4242",
    fechaVencimiento: "11/27",
    cvc: "123",
    titular: "APRO",
    tipo: "Visa Débito / Crédito (Aprobación Inmediata)",
  },
  docUrl: "https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-cards",
};
