"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductoCard } from "./ProductoCard";
import type { Producto } from "../types/types";

const MOCK_OFERTAS: Producto[] = [
  {
    id: "o1",
    nombre: "NVIDIA GeForce RTX 4080 Super 16GB",
    descripcion: "Arquitectura Ada Lovelace con DLSS 3.5 y rendimiento masivo en 4K.",
    precio: 1999000,
    precioOferta: 1549000,
    stock: 4,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWX3bfpju9Pa0yZXJIJ1Ur4ULqeO3o-YktB6dDt4NibRDy-3WA09S55UPJ-elnLyW_Z3Dv_APKww1Eeu4vP4A0A7o9f0fQ_3zEgs9F4hUJWTIVRBEMBAJp9HVoO05Ak6lX-D73idAYZ7BlvyvWOPClrcPn_CwwkqT5S28S2mdO5RrmsyH7hOIiwaIBN__g9r_rL-MRgxGyiDSDpJI2sSXnbJe2SGCjaXACvtfvK0K7hCCEwA4E4FKy",
    public_id: "rtx-4080-super",
    created_at: new Date().toISOString(),
    categoria: "Tarjetas Gráficas",
    subcategoria: "NVIDIA",
    subcategoria_id: 1,
    caracteristicas: [{ clave: "Memoria", valor: "16GB GDDR6X" }],
  },
  {
    id: "o2",
    nombre: "Intel Core i9-14900K Processor",
    descripcion: "24 núcleos y velocidades extremas para creadores y gamers profesionales.",
    precio: 950000,
    precioOferta: 729000,
    stock: 6,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
    public_id: "i9-14900k",
    created_at: new Date().toISOString(),
    categoria: "Procesadores",
    subcategoria: "Intel",
    subcategoria_id: 2,
    caracteristicas: [{ clave: "Núcleos", valor: "24C / 32T" }],
  },
  {
    id: "o3",
    nombre: "G.Skill Trident Z5 RGB 64GB DDR5 6400MHz",
    descripcion: "Memoria DDR5 de altísima velocidad con iluminación RGB y latencias optimizadas.",
    precio: 480000,
    precioOferta: 359000,
    stock: 8,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlOKdgRAKO7axgPLoIgkCRBAIPe6bsUaBE8vP6H9Bvv-GKDMIu_rSFc0qyF7ezSYtLOY5R6GacDs31OXReUXhA4UG-RhNp0_lQHPyACkypX7peSe8m2Peb8moXxODRAzR4vnS1UsctLGRF5z2BQv0AsqMIJc_4r7lc1Ql_c-APM9BPWmXqDZ0NUSZxKJFP45-LQW2J48oNiUfZ9AvpdpifNc7mBHIFM0Qq5suWwe6pjS1-mqSxzKwi",
    public_id: "gskill-ddr5-64gb",
    created_at: new Date().toISOString(),
    categoria: "Memorias RAM",
    subcategoria: "G.Skill",
    subcategoria_id: 3,
    caracteristicas: [{ clave: "Velocidad", valor: "6400 MT/s" }],
  },
  {
    id: "o4",
    nombre: "Samsung 990 Pro 2TB NVMe PCIe 5.0",
    descripcion: "SSD de próxima generación con velocidades de lectura de hasta 14000MB/s.",
    precio: 320000,
    precioOferta: 239000,
    stock: 10,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuApZtDzJ_Y22NBIP9TSZ1Jss3PR6FGUPUXyBSaMk1yiar1h501O3lMBXa0i3YjH_5qh8ofw9nscNz-M-T35JaAivPObzAAURjwauos1NW5WgcYwi5xzzCffvKhVo68S6CCrhavUmhcueqpoY19fJ1AALCGlGlN4XvbXw3MwYrnGPFkDd7sdw9R-p2ZQVN6uJf_rPAa0eszkacEETVdZIcPAiVrFKwYXloE5mHiweCU82795GkD02gBq",
    public_id: "samsung-990-pro-2tb",
    created_at: new Date().toISOString(),
    categoria: "Almacenamiento",
    subcategoria: "Samsung",
    subcategoria_id: 4,
    caracteristicas: [{ clave: "Interfaz", valor: "PCIe 5.0" }],
  },
  {
    id: "o5",
    nombre: "Corsair RM1000x Shift 1000W 80+ Gold Modular",
    descripcion: "Fuente con conectores laterales y cableado completamente modular.",
    precio: 490000,
    precioOferta: 369000,
    stock: 5,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWX3bfpju9Pa0yZXJIJ1Ur4ULqeO3o-YktB6dDt4NibRDy-3WA09S55UPJ-elnLyW_Z3Dv_APKww1Eeu4vP4A0A7o9f0fQ_3zEgs9F4hUJWTIVRBEMBAJp9HVoO05Ak6lX-D73idAYZ7BlvyvWOPClrcPn_CwwkqT5S28S2mdO5RrmsyH7hOIiwaIBN__g9r_rL-MRgxGyiDSDpJI2sSXnbJe2SGCjaXACvtfvK0K7hCCEwA4E4FKy",
    public_id: "corsair-rm1000x-shift",
    created_at: new Date().toISOString(),
    categoria: "Fuentes de Poder",
    subcategoria: "Corsair",
    subcategoria_id: 5,
    caracteristicas: [{ clave: "Certificación", valor: "80 Plus Gold" }],
  },
  {
    id: "o6",
    nombre: "ASUS TUF Gaming B650-PLUS WiFi AM5",
    descripcion: "Placa madre robusta para Ryzen 7000 con soporte DDR5 y PCIe 5.0.",
    precio: 390000,
    precioOferta: 289000,
    stock: 7,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
    public_id: "asus-tuf-b650-plus",
    created_at: new Date().toISOString(),
    categoria: "Mothers",
    subcategoria: "ASUS",
    subcategoria_id: 6,
    caracteristicas: [{ clave: "Socket", valor: "AM5" }],
  },
  {
    id: "o7",
    nombre: "Fractal Design Torrent Black TG Dark",
    descripcion: "Gabinete con ventilación masiva de fábrica y flujo de aire frontal irrestricto.",
    precio: 310000,
    precioOferta: 229000,
    stock: 9,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlOKdgRAKO7axgPLoIgkCRBAIPe6bsUaBE8vP6H9Bvv-GKDMIu_rSFc0qyF7ezSYtLOY5R6GacDs31OXReUXhA4UG-RhNp0_lQHPyACkypX7peSe8m2Peb8moXxODRAzR4vnS1UsctLGRF5z2BQv0AsqMIJc_4r7lc1Ql_c-APM9BPWmXqDZ0NUSZxKJFP45-LQW2J48oNiUfZ9AvpdpifNc7mBHIFM0Qq5suWwe6pjS1-mqSxzKwi",
    public_id: "fractal-torrent",
    created_at: new Date().toISOString(),
    categoria: "Gabinetes",
    subcategoria: "Fractal",
    subcategoria_id: 7,
    caracteristicas: [{ clave: "Tipo", valor: "Mid Tower" }],
  },
  {
    id: "o8",
    nombre: "Logitech G Pro X Superlight 2 DEX Mouse",
    descripcion: "Mouse ultraliviano de 60g con sensor HERO 2 de 44000 DPI para gaming profesional.",
    precio: 145000,
    precioOferta: 109000,
    stock: 15,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuApZtDzJ_Y22NBIP9TSZ1Jss3PR6FGUPUXyBSaMk1yiar1h501O3lMBXa0i3YjH_5qh8ofw9nscNz-M-T35JaAivPObzAAURjwauos1NW5WgcYwi5xzzCffvKhVo68S6CCrhavUmhcueqpoY19fJ1AALCGlGlN4XvbXw3MwYrnGPFkDd7sdw9R-p2ZQVN6uJf_rPAa0eszkacEETVdZIcPAiVrFKwYXloE5mHiweCU82795GkD02gBq",
    public_id: "logitech-gpro-x2-dex",
    created_at: new Date().toISOString(),
    categoria: "Periféricos",
    subcategoria: "Logitech",
    subcategoria_id: 8,
    caracteristicas: [{ clave: "Peso", valor: "60g" }],
  },
  {
    id: "o9",
    nombre: "LG UltraGear 32GQ950 32\" 4K 144Hz Nano IPS",
    descripcion: "Monitor 4K de 32 pulgadas con cobertura del 98% DCI-P3 y soporte G-Sync.",
    precio: 980000,
    precioOferta: 749000,
    stock: 4,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWX3bfpju9Pa0yZXJIJ1Ur4ULqeO3o-YktB6dDt4NibRDy-3WA09S55UPJ-elnLyW_Z3Dv_APKww1Eeu4vP4A0A7o9f0fQ_3zEgs9F4hUJWTIVRBEMBAJp9HVoO05Ak6lX-D73idAYZ7BlvyvWOPClrcPn_CwwkqT5S28S2mdO5RrmsyH7hOIiwaIBN__g9r_rL-MRgxGyiDSDpJI2sSXnbJe2SGCjaXACvtfvK0K7hCCEwA4E4FKy",
    public_id: "lg-ultragear-4k-144",
    created_at: new Date().toISOString(),
    categoria: "Monitores",
    subcategoria: "LG",
    subcategoria_id: 9,
    caracteristicas: [{ clave: "Resolución", valor: "4K UHD" }],
  },
  {
    id: "o10",
    nombre: "Cooler Master Hyper 622 Halo Black",
    descripcion: "Disipador de aire dual-tower con ventiladores Halo ARGB de 120mm.",
    precio: 98000,
    precioOferta: 72000,
    stock: 12,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
    public_id: "cm-hyper-622-halo",
    created_at: new Date().toISOString(),
    categoria: "Refrigeración",
    subcategoria: "Cooler Master",
    subcategoria_id: 10,
    caracteristicas: [{ clave: "Tipo", valor: "Dual Tower" }],
  },
];

interface SeccionOfertasProps {
  productos?: Producto[];
  onAddToCart?: (producto: Producto) => void;
}

export function SeccionOfertas({
  productos = MOCK_OFERTAS,
  onAddToCart,
}: SeccionOfertasProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(4);
  const [gapPx, setGapPx] = useState(24);

  const touchStartX = useRef<number | null>(null);

  // Solo productos en oferta y con stock
  const productosEnOferta = productos.filter(
    (p) => p.stock > 0 && p.precioOferta != null && p.precioOferta < p.precio
  );
  const totalItems = productosEnOferta.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsVisible(2.25); // 2 cards completas + 3ra asomada (< 50%)
        setGapPx(12);
      } else if (window.innerWidth < 1024) {
        setItemsVisible(2);
        setGapPx(24);
      } else {
        setItemsVisible(4);
        setGapPx(24);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, totalItems - Math.floor(itemsVisible));

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));

  // Touch handlers para swipe en mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 40) {
      handleNext();
    } else if (diffX < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  if (productosEnOferta.length === 0) return null;

  return (
    <section className="w-full py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-black text-ink tracking-tight">
            Productos en <span className="text-primary font-black">oferta</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Anterior oferta"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Siguiente oferta"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Carrusel Deslizante */}
      <div
        className="relative py-2 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out gap-3 sm:gap-6"
          style={{
            transform: `translateX(calc(-${currentIndex} * (100% + ${gapPx}px) / ${itemsVisible}))`,
          }}
        >
          {productosEnOferta.map((producto) => (
            <div
              key={producto.id}
              className="w-[calc((100%-12px)/2.25)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3*1.5rem)/4)] shrink-0"
            >
              <ProductoCard producto={producto} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SeccionOfertas;
