"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductoCard } from "./ProductoCard";
import type { Producto } from "../types/types";

// Productos destacados por defecto para desarrollo/preview
const MOCK_DESTACADOS: Producto[] = [
  {
    id: "1",
    nombre: "NVIDIA GeForce RTX 4070 OC 12GB",
    descripcion: "Potencia absoluta en Ray Tracing y gráficos acelerados por IA de última generación para gaming 4K.",
    precio: 1299000,
    stock: 8,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWX3bfpju9Pa0yZXJIJ1Ur4ULqeO3o-YktB6dDt4NibRDy-3WA09S55UPJ-elnLyW_Z3Dv_APKww1Eeu4vP4A0A7o9f0fQ_3zEgs9F4hUJWTIVRBEMBAJp9HVoO05Ak6lX-D73idAYZ7BlvyvWOPClrcPn_CwwkqT5S28S2mdO5RrmsyH7hOIiwaIBN__g9r_rL-MRgxGyiDSDpJI2sSXnbJe2SGCjaXACvtfvK0K7hCCEwA4E4FKy",
    public_id: "rtx-4070",
    created_at: new Date().toISOString(),
    categoria: "Tarjetas Gráficas",
    subcategoria: "NVIDIA",
    subcategoria_id: 1,
    caracteristicas: [{ clave: "Memoria", valor: "12GB GDDR6X" }]
  },
  {
    id: "2",
    nombre: "AMD Ryzen 7 7800X3D Processor",
    descripcion: "El procesador de gaming más rápido del mundo con tecnología 3D V-Cache de alto rendimiento.",
    precio: 849000,
    stock: 12,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
    public_id: "ryzen-7800x3d",
    created_at: new Date().toISOString(),
    categoria: "Procesadores",
    subcategoria: "AMD",
    subcategoria_id: 2,
    caracteristicas: [{ clave: "Núcleos", valor: "8 Cores / 16 Threads" }]
  },
  {
    id: "3",
    nombre: "Corsair Dominator 32GB (2x16GB) DDR5 6000MHz",
    descripcion: "Memoria RAM DDR5 ultra rápida optimizada para entusiastas del overclocking y creadores de contenido.",
    precio: 359000,
    stock: 5,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlOKdgRAKO7axgPLoIgkCRBAIPe6bsUaBE8vP6H9Bvv-GKDMIu_rSFc0qyF7ezSYtLOY5R6GacDs31OXReUXhA4UG-RhNp0_lQHPyACkypX7peSe8m2Peb8moXxODRAzR4vnS1UsctLGRF5z2BQv0AsqMIJc_4r7lc1Ql_c-APM9BPWmXqDZ0NUSZxKJFP45-LQW2J48oNiUfZ9AvpdpifNc7mBHIFM0Qq5suWwe6pjS1-mqSxzKwi",
    public_id: "dominator-32gb-ddr5",
    created_at: new Date().toISOString(),
    categoria: "Memorias RAM",
    subcategoria: "DDR5",
    subcategoria_id: 3,
    caracteristicas: [{ clave: "Velocidad", valor: "6000 MT/s" }]
  },
  {
    id: "4",
    nombre: "Fuente Modular EVGA Core Gold 1000W 80 Plus",
    descripcion: "Eficiencia certificación 80 Plus Gold con cableado modular completo y capacitores japoneses de alta resistencia.",
    precio: 420000,
    stock: 0, // Sin stock, se filtrará automáticamente
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuApZtDzJ_Y22NBIP9TSZ1Jss3PR6FGUPUXyBSaMk1yiar1h501O3lMBXa0i3YjH_5qh8ofw9nscNz-M-T35JaAivPObzAAURjwauos1NW5WgcYwi5xzzCffvKhVo68S6CCrhavUmhcueqpoY19fJ1AALCGlGlN4XvbXw3MwYrnGPFkDd7sdw9R-p2ZQVN6uJf_rPAa0eszkacEETVdZIcPAiVrFKwYXloE5mHiweCU82795GkD02gBq",
    public_id: "fuente-1000w-gold",
    created_at: new Date().toISOString(),
    categoria: "Fuentes de Poder",
    subcategoria: "Modular",
    subcategoria_id: 4,
    caracteristicas: [{ clave: "Certificación", valor: "80 Plus Gold" }]
  }
];

interface SeccionDestacadosProps {
  productos?: Producto[];
  onAddToCart?: (producto: Producto) => void;
}

export function SeccionDestacados({
  productos = MOCK_DESTACADOS,
  onAddToCart,
}: SeccionDestacadosProps) {
  // Filtrar solo productos con stock disponible (> 0)
  const productosDisponibles = productos.filter((p) => p.stock > 0);

  return (
    <section className="w-full py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header de la Sección estilo Categorías */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Productos <span className="text-primary font-black">destacados</span>
          </h2>
        </div>

        <Link
          href="/productos"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover hover:underline transition-all group"
        >
          <span>Ver todo el catálogo</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid de Productos con Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productosDisponibles.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}

export default SeccionDestacados;
