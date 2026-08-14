import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
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

export const metadata = {
  title: "Centro de Ayuda - NexusPC",
  description: "Preguntas frecuentes, envíos, métodos de pago y garantías de NexusPC.",
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

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-primary-tint text-primary rounded-2xl mb-1 shadow-2xs">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            Centro de <span className="text-primary font-black">Ayuda</span>
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary">
            Encontrá respuestas rápidas a tus consultas sobre compras, envíos, formas de pago y soporte técnico.
          </p>
        </div>

        {/* Pilares Informativos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-2.5 shadow-2xs hover:border-primary/40 transition-colors">
            <Truck className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-sm text-ink">Envíos a todo el país</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Seguimiento online y embalaje reforzado para proteger tu hardware.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-5 space-y-2.5 shadow-2xs hover:border-primary/40 transition-colors">
            <CreditCard className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-sm text-ink">Pagos seguros</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Plataformas encriptadas con cuotas sin interés y transferencias.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-5 space-y-2.5 shadow-2xs hover:border-primary/40 transition-colors">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-sm text-ink">Garantía oficial</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Productos 100% originales con respaldo directo de fábrica.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-5 space-y-2.5 shadow-2xs hover:border-primary/40 transition-colors">
            <RotateCcw className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-sm text-ink">Cambios y devoluciones</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              10 días de cambio directo si el producto presenta fallas de origen.
            </p>
          </div>
        </div>

        {/* Preguntas Frecuentes (FAQ Accordion) */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight border-b border-border/60 pb-3">
            Preguntas Frecuentes
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-surface border border-border rounded-2xl p-4 sm:p-5 [&_summary::-webkit-details-marker]:hidden shadow-2xs cursor-pointer transition-all"
              >
                <summary className="flex items-center justify-between font-bold text-sm sm:text-base text-ink select-none group-open:text-primary transition-colors">
                  <span>{faq.pregunta}</span>
                  <ChevronDown className="w-4 h-4 text-ink-secondary transition-transform duration-200 group-open:rotate-180 group-open:text-primary shrink-0 ml-2" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-ink-secondary leading-relaxed border-t border-border/40 pt-3">
                  {faq.respuesta}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Canales de Contacto */}
        <div className="bg-primary-tint/60 border border-primary/20 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-black text-ink">¿No encontraste lo que buscabas?</h3>
            <p className="text-xs sm:text-sm text-ink-secondary">
              Nuestro equipo de soporte técnico y asesoramiento gamer está listo para ayudarte.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3.5 bg-surface border border-border rounded-xl text-xs font-bold text-ink shadow-2xs">
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>WhatsApp Soporte</span>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-surface border border-border rounded-xl text-xs font-bold text-ink shadow-2xs">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <span>soporte@nexuspc.com</span>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-surface border border-border rounded-xl text-xs font-bold text-ink shadow-2xs">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <span>0800-888-NEXUS</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
