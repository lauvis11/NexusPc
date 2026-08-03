"use client";

import { Header } from "../../../../shared/components/layout/Header";
import { Footer } from "../../../../shared/components/layout/Footer";
import { ProductoPricing } from "../../../../features/productos/components/ProductoPricing";
import { Especificaciones } from "../../../../features/productos/components/Especificaciones";
import type { Producto } from "../../../../features/productos/types/types";

// Mock del producto individual para prueba
const MOCK_PRODUCTO_INDIVIDUAL: Producto = {
  id: "ryzen-7800x3d",
  nombre: "AMD Ryzen 7 7800X3D Processor",
  descripcion:
    "El procesador de gaming más rápido del mundo con tecnología 3D V-Cache de alto rendimiento y arquitectura Zen 4 para máximo FPS en resolución 1080p, 1440p y 4K.\n\nDiseñado específicamente para jugadores exigentes y creadores de contenido, el AMD Ryzen™ 7 7800X3D ofrece 8 núcleos y 16 hilos de procesamiento con 96MB de memoria caché L3 apilada en 3D. Esto reduce drásticamente la latencia en juegos competitivos y títulos AAA de última generación.\n\nCompatible con el socket AM5 de última generación, soporte nativo para memorias RAM DDR5 y conectividad PCIe 5.0 para las placas de video y SSDs NVMe más rápidos del mercado. Garantiza máxima estabilidad térmica y eficiencia energética durante largas sesiones de juego intensivo.",
  precio: 849000,
  precioOferta: 729000,
  stock: 12,
  img_url:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
  public_id: "ryzen-7800x3d",
  created_at: new Date().toISOString(),
  categoria: "Procesadores",
  subcategoria: "AMD",
  subcategoria_id: 2,
  caracteristicas: [
    { clave: "VRAM", valor: "8GB" },
    { clave: "Memoria", valor: "GDDR7" },
    { clave: "Bus", valor: "128-bit" },
    { clave: "Arquitectura", valor: "Zen 4" },
    { clave: "Núcleos / Hilos", valor: "8 Cores / 16 Threads" },
    { clave: "Frecuencia Base", valor: "4.2 GHz" },
    { clave: "Frecuencia Max Boost", valor: "Hasta 5.0 GHz" },
    { clave: "Caché L3 Total", valor: "96 MB (3D V-Cache)" },
    { clave: "Socket", valor: "AM5" },
    { clave: "TDP", valor: "120W" },
  ],
};

export default function ProductoIndividualPage() {
  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      {/* Header Modular */}
      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        {/* Componente Primera Sección: Pricing & Galería */}
        <ProductoPricing producto={MOCK_PRODUCTO_INDIVIDUAL} />

        {/* Componente Segunda Sección: Especificaciones & Descripción (Pestañas) */}
        <Especificaciones
          caracteristicas={MOCK_PRODUCTO_INDIVIDUAL.caracteristicas}
          descripcion={MOCK_PRODUCTO_INDIVIDUAL.descripcion}
          nombre={MOCK_PRODUCTO_INDIVIDUAL.nombre}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
