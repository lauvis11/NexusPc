"use client";

import { Header } from "../../../../shared/components/layout/Header";
import { Footer } from "../../../../shared/components/layout/Footer";
import { ProductoPricing } from "../../../../features/productos/components/ProductoPricing";
import type { Producto } from "../../../../features/productos/types/types";

// Mock del producto individual para prueba
const MOCK_PRODUCTO_INDIVIDUAL: Producto = {
  id: "ryzen-7800x3d",
  nombre: "AMD Ryzen 7 7800X3D Processor",
  descripcion:
    "El procesador de gaming más rápido del mundo con tecnología 3D V-Cache de alto rendimiento y arquitectura Zen 4 para máximo FPS.",
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Componente Primera Sección: Pricing & Galería */}
        <ProductoPricing producto={MOCK_PRODUCTO_INDIVIDUAL} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
