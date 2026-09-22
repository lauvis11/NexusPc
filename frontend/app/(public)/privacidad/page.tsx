import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { JsonLd } from "@/shared/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import {
  ShieldCheck,
  Lock,
  Database,
  UserCheck,
  CreditCard,
  Mail,
  ChevronRight,
  Code2,
  AlertTriangle,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad y Naturaleza del Proyecto",
  description:
    "Información sobre la naturaleza demostrativa de NexusPC como proyecto personal, tratamiento de datos de usuarios y entorno de pruebas.",
  alternates: {
    canonical: `${SITE_URL}/privacidad`,
  },
  openGraph: {
    title: "Política de Privacidad | NexusPC",
    description:
      "Aviso sobre el uso de datos, pasarela de pruebas y contexto del proyecto personal NexusPC.",
    url: `${SITE_URL}/privacidad`,
  },
};

const privacySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Política de Privacidad de NexusPC",
  url: `${SITE_URL}/privacidad`,
  description:
    "Información sobre el tratamiento de datos y contexto demostrativo de la aplicación NexusPC.",
  inLanguage: "es",
  publisher: {
    "@type": "Organization",
    name: "NexusPC",
    url: SITE_URL,
  },
};

export default function PrivacidadPage() {
  const secciones = [
    {
      id: "naturaleza-proyecto",
      icon: Code2,
      titulo: "1. Naturaleza del proyecto y fines demostrativos",
      contenido: [
        "NexusPC es una aplicación web desarrollada exclusivamente como un proyecto personal de desarrollo de software y portafolio técnico full-stack.",
        "• Sin actividad comercial real: El catálogo de productos, precios y especificaciones exhibidos tienen fines demostrativos y de simulación de un e-commerce moderno.",
        "• Sin ventas ni envíos físicos: No se venden componentes de hardware reales ni se despacha mercadería ante órdenes generadas en la plataforma.",
      ],
    },
    {
      id: "pagos-pruebas",
      icon: CreditCard,
      titulo: "2. Pasarela de pagos en modo prueba (Sandbox)",
      contenido: [
        "El sistema de compras y checkout está integrado con pasarelas de pago (como Mercado Pago) configuradas únicamente en Modo Sandbox / Pruebas:",
        "• Sin cobros de dinero real: Las órdenes completadas en la web no debitan dinero de cuentas bancarias ni tarjetas reales.",
        "• Advertencia de seguridad: Por tratarse de un entorno de pruebas y demostración, se solicita NO ingresar datos de tarjetas de crédito o débito reales. Para simular compras, se recomienda utilizar las tarjetas de prueba provistas por la pasarela de pagos.",
        "• La plataforma no almacena ni procesa números de tarjetas reales, códigos de seguridad (CVV) ni datos bancarios sensibles.",
      ],
    },
    {
      id: "datos-almacenados",
      icon: Database,
      titulo: "3. Información que se recopila y almacena",
      contenido: [
        "Para permitir la interacción con las funcionalidades del sistema (crear cuenta, iniciar sesión y simular pedidos), se almacenan los siguientes datos mínimos en la base de datos:",
        "• Datos de cuenta: Nombre de usuario y dirección de correo electrónico.",
        "• Credenciales de acceso: Las contraseñas ingresadas se guardan de forma encriptada mediante algoritmos seguros de hashing unidireccional (bcrypt). Nunca se guardan contraseñas en texto plano.",
        "• Carrito y preferencias: Almacenamiento local en el navegador (localStorage) para mantener los productos seleccionados durante la navegación de prueba.",
      ],
    },
    {
      id: "finalidad-datos",
      icon: Info,
      titulo: "4. Finalidad del uso de los datos",
      contenido: [
        "La información registrada al crear una cuenta se utiliza únicamente para fines técnicos y operativos del proyecto:",
        "• Habilitar el acceso a la cuenta de usuario, panel personal y persistencia de sesión.",
        "• Simular el flujo de generación de órdenes y consultar el historial de compras de prueba.",
        "• Privacidad: Los correos electrónicos NO se venden, NO se ceden a terceros y NO se utilizan para el envío de correos masivos ni publicidad no solicitada (spam).",
      ],
    },
    {
      id: "seguridad-sesiones",
      icon: Lock,
      titulo: "5. Seguridad y protección de sesiones",
      contenido: [
        "A pesar de ser un proyecto demostrativo, se aplican buenas prácticas de seguridad utilizadas en entornos web modernos:",
        "• Cifrado de contraseñas mediante hashing seguro en la base de datos.",
        "• Manejo de sesiones mediante tokens web JSON (JWT) almacenados en cookies seguras con atributos 'httpOnly' y 'SameSite', lo que previene accesos indebidos mediante scripts de terceros (XSS / CSRF).",
      ],
    },
    {
      id: "cookies",
      icon: ShieldCheck,
      titulo: "6. Uso de Cookies y almacenamiento local",
      contenido: [
        "La aplicación utiliza únicamente mecanismos de almacenamiento esenciales para el funcionamiento técnico del sitio:",
        "• Cookies técnicas de sesión: Permiten mantener la autenticación del usuario durante la navegación.",
        "• Almacenamiento local del navegador (localStorage): Utilizado por el gestor de estado para que los productos agregados al carrito persistan al recargar la página.",
        "• No se emplean cookies publicitarias, de rastreo entre sitios ni herramientas de analítica invasiva de terceros.",
      ],
    },
    {
      id: "eliminacion-datos",
      icon: UserCheck,
      titulo: "7. Eliminación de cuentas y datos de prueba",
      contenido: [
        "Cualquier cuenta creada para probar la aplicación puede ser eliminada junto con su historial de la base de datos:",
        "• Basta con solicitar la baja indicando el correo registrado para que los datos sean removidos de forma definitiva del sistema.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      {/* Datos Estructurados Schema.org */}
      <JsonLd data={privacySchema} />

      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 sm:space-y-12">
        {/* Breadcrumb de navegación */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-secondary font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-ink-secondary/60 shrink-0" />
          <span className="text-ink font-bold">Política de Privacidad</span>
        </nav>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3.5 bg-primary-tint text-primary rounded-2xl mb-1 shadow-2xs">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
            Política de <span className="text-primary">Privacidad</span>
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-2xl mx-auto">
            Información sobre el tratamiento de datos, el entorno de pruebas y la naturaleza demostrativa de este proyecto.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border/80 rounded-full text-xs font-semibold text-ink-secondary">
            <span>Proyecto Personal &bull; Entorno Demostrativo</span>
          </div>
        </div>

        {/* Banner de Aviso Importante */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-ink space-y-1">
            <p className="font-bold text-amber-700 dark:text-amber-400">
              Aviso sobre compras y pagos:
            </p>
            <p className="text-ink-secondary leading-relaxed">
              NexusPC es una plataforma desarrollada como demostración técnica. Los productos exhibidos no están a la venta y la pasarela de pagos funciona en <strong>modo prueba (Sandbox)</strong>. No se deben ingresar datos de tarjetas reales.
            </p>
          </div>
        </div>

        {/* Secciones Detalladas */}
        <div className="space-y-6">
          {secciones.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                id={sec.id}
                className="p-6 sm:p-8 bg-surface border border-border rounded-2xl shadow-2xs space-y-4 scroll-mt-28"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-ink tracking-tight">
                    {sec.titulo}
                  </h2>
                </div>

                <div className="space-y-2.5 text-sm sm:text-base text-ink-secondary leading-relaxed pl-0 sm:pl-12">
                  {sec.contenido.map((parrafo, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {parrafo}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tarjeta de Contacto y Solicitud de Baja */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary-tint via-surface to-surface border border-primary/20 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-surface flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ink">
                Solicitud de baja o consultas sobre el proyecto
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary">
                Es posible solicitar la eliminación de cualquier cuenta o realizar consultas técnicas contactando directamente.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
