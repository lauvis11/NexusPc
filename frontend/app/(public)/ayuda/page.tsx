import type { Metadata } from "next";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { JsonLd } from "@/shared/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import {
  HelpCircle,
  Truck,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Centro de Ayuda y Preguntas Frecuentes",
  description:
    "Encontrá respuestas sobre métodos de pago, envíos a todo el país, seguimiento de pedidos, garantías oficiales y facturación A/B en NexusPC.",
  alternates: {
    canonical: `${SITE_URL}/ayuda`,
  },
  openGraph: {
    title: "Centro de Ayuda | NexusPC",
    description:
      "Preguntas frecuentes sobre envíos, medios de pago, garantías y soporte post-venta.",
    url: `${SITE_URL}/ayuda`,
  },
};

const FAQS = [
  {
    pregunta: "¿Cuáles son los métodos de pago aceptados?",
    respuesta:
      "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, Cabal), Mercado Pago, transferencias bancarias directas con descuento especial y efectivo contra entrega en sucursales autorizadas.",
  },
  {
    pregunta: "¿Cómo se realizan los envíos y cuánto tardan?",
    respuesta:
      "Realizamos envíos a todo el país mediante correo privado con seguro total. Para CABA y GBA contamos con envíos express en 24/48hs hábiles. Para el resto del país la demora estimada es de 2 a 5 días hábiles.",
  },
  {
    pregunta: "¿Todos los productos tienen garantía oficial?",
    respuesta:
      "Sí, todos nuestros componentes y equipos cuentan con garantía oficial de fabricante y garantía directa de NexusPC de hasta 12 a 36 meses según la marca y tipo de producto.",
  },
  {
    pregunta: "¿Cómo hago el seguimiento de mi pedido?",
    respuesta:
      "Una vez despachado tu pedido, recibirás un correo electrónico con el número de guía y el enlace de seguimiento en tiempo real de la empresa de logística.",
  },
  {
    pregunta: "¿Puedo solicitar factura A?",
    respuesta:
      "Sí, emitimos facturas A y B. Solo debes ingresar tu CUIT y Razón Social durante el proceso de checkout o en los datos de facturación de tu cuenta.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.pregunta,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.respuesta,
    },
  })),
};

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      {/* Datos Estructurados FAQPage Schema */}
      <JsonLd data={faqSchema} />

      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-primary-tint text-primary rounded-2xl mb-1 shadow-2xs">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            ¿Cómo podemos <span className="text-primary">ayudarte</span>?
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary">
            Encontrá respuestas rápidas a las consultas más habituales sobre compras, envíos y garantías.
          </p>
        </div>

        {/* Tarjetas de Categorías de Soporte */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-surface border border-border rounded-2xl shadow-xs space-y-2 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-1">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-sm text-ink">Envíos y Entregas</h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Tiempos, costos y empresas de logística para todo el país.
            </p>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl shadow-xs space-y-2 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-sm text-ink">Medios de Pago</h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Cuotas sin interés, transferencias y promociones bancarias.
            </p>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl shadow-xs space-y-2 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-sm text-ink">Garantía Oficial</h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Cobertura de hasta 36 meses directo con marcas líderes.
            </p>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl shadow-xs space-y-2 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-sm text-ink">Cambios y RMA</h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Políticas de devolución y gestión técnica ágil.
            </p>
          </div>
        </div>

        {/* Sección Preguntas Frecuentes (Acordeón Simple) */}
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-black text-ink tracking-tight">
              Preguntas <span className="text-primary">Frecuentes</span>
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-surface border border-border rounded-2xl p-4 sm:p-5 [&_summary::-webkit-details-marker]:hidden shadow-2xs transition-all open:border-primary/40 open:bg-primary-tint/20"
              >
                <summary className="flex items-center justify-between cursor-pointer font-bold text-sm sm:text-base text-ink select-none gap-4">
                  <span>{faq.pregunta}</span>
                  <ChevronDown className="w-5 h-5 text-ink-secondary transition-transform duration-200 group-open:rotate-180 shrink-0 group-open:text-primary" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-ink-secondary leading-relaxed border-t border-border/50 pt-3">
                  {faq.respuesta}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Canales de Contacto Directo */}
        <div className="bg-gradient-to-br from-surface to-primary-tint/30 border border-primary/20 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-xs">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary">
              Nuestro equipo de soporte técnico y atención comercial está disponible para ayudarte.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="https://wa.me/5491112345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Soporte</span>
            </a>
            <a
              href="mailto:soporte@nexuspc.com.ar"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface border border-border hover:border-primary text-ink font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-primary" />
              <span>soporte@nexuspc.com.ar</span>
            </a>
            <a
              href="tel:08001234567"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface border border-border hover:border-primary text-ink font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>0800-123-4567</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
