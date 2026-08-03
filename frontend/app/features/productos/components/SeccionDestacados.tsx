"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductoCard } from "./ProductoCard";
import type { Producto } from "../types/types";

// 10 Productos destacados hardcodeados
const MOCK_DESTACADOS: Producto[] = [
  {
    id: "1",
    nombre: "NVIDIA GeForce RTX 4070 OC 12GB",
    descripcion: "Potencia absoluta en Ray Tracing y gráficos acelerados por IA.",
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
    descripcion: "El procesador de gaming más rápido del mundo con tecnología 3D V-Cache.",
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
    descripcion: "Memoria RAM DDR5 ultra rápida optimizada para overclocking.",
    precio: 359000,
    stock: 5,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlOKdgRAKO7axgPLoIgkCRBAIPe6bsUaBE8vP6H9Bvv-GKDMIu_rSFc0qyF7ezSYtLOY5R6GacDs31OXReUXhA4UG-RhNp0_lQHPyACkypX7peSe8m2Peb8moXxODRAzR4vnS1UsctLGRF5z2BQv0AsqMIJc_4r7lc1Ql_c-APM9BPWmXqDZ0NUSZxKJFP45-LQW2J48oNiUfZ9AvpdpifNc7mBHIFM0Qq5suWwe6pjS1-mqSxzKwi",
    public_id: "dominator-32gb-ddr5",
    created_at: new Date().toISOString(),
    categoria: "Memorias RAM",
    subcategoria: "Corsair",
    subcategoria_id: 3,
    caracteristicas: [{ clave: "Velocidad", valor: "6000 MT/s" }]
  },
  {
    id: "4",
    nombre: "SSD Kingston Fury Renegade 2TB PCIe 4.0 NVMe",
    descripcion: "Almacenamiento ultra veloz con hasta 7300MB/s de lectura y disipador integrado.",
    precio: 210000,
    stock: 15,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuApZtDzJ_Y22NBIP9TSZ1Jss3PR6FGUPUXyBSaMk1yiar1h501O3lMBXa0i3YjH_5qh8ofw9nscNz-M-T35JaAivPObzAAURjwauos1NW5WgcYwi5xzzCffvKhVo68S6CCrhavUmhcueqpoY19fJ1AALCGlGlN4XvbXw3MwYrnGPFkDd7sdw9R-p2ZQVN6uJf_rPAa0eszkacEETVdZIcPAiVrFKwYXloE5mHiweCU82795GkD02gBq",
    public_id: "ssd-kingston-2tb",
    created_at: new Date().toISOString(),
    categoria: "Almacenamiento",
    subcategoria: "Kingston",
    subcategoria_id: 4,
    caracteristicas: [{ clave: "Capacidad", valor: "2TB" }]
  },
  {
    id: "5",
    nombre: "Water Cooler NZXT Kraken 360 RGB Black",
    descripcion: "Refrigeración líquida de 360mm con pantalla LCD personalizable y ventiladores RGB.",
    precio: 380000,
    stock: 6,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlOKdgRAKO7axgPLoIgkCRBAIPe6bsUaBE8vP6H9Bvv-GKDMIu_rSFc0qyF7ezSYtLOY5R6GacDs31OXReUXhA4UG-RhNp0_lQHPyACkypX7peSe8m2Peb8moXxODRAzR4vnS1UsctLGRF5z2BQv0AsqMIJc_4r7lc1Ql_c-APM9BPWmXqDZ0NUSZxKJFP45-LQW2J48oNiUfZ9AvpdpifNc7mBHIFM0Qq5suWwe6pjS1-mqSxzKwi",
    public_id: "nzxt-kraken-360",
    created_at: new Date().toISOString(),
    categoria: "Refrigeración",
    subcategoria: "NZXT",
    subcategoria_id: 5,
    caracteristicas: [{ clave: "Tamaño", valor: "360mm" }]
  },
  {
    id: "6",
    nombre: "Gabinete Lian Li O11 Dynamic EVO Black",
    descripcion: "Gabinete modular premium con paneles de vidrio templado y flujo de aire masivo.",
    precio: 280000,
    stock: 8,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuApZtDzJ_Y22NBIP9TSZ1Jss3PR6FGUPUXyBSaMk1yiar1h501O3lMBXa0i3YjH_5qh8ofw9nscNz-M-T35JaAivPObzAAURjwauos1NW5WgcYwi5xzzCffvKhVo68S6CCrhavUmhcueqpoY19fJ1AALCGlGlN4XvbXw3MwYrnGPFkDd7sdw9R-p2ZQVN6uJf_rPAa0eszkacEETVdZIcPAiVrFKwYXloE5mHiweCU82795GkD02gBq",
    public_id: "lian-li-o11-evo",
    created_at: new Date().toISOString(),
    categoria: "Gabinetes",
    subcategoria: "Lian Li",
    subcategoria_id: 6,
    caracteristicas: [{ clave: "Tipo", valor: "Mid Tower" }]
  },
  {
    id: "7",
    nombre: "ASUS ROG Strix X670E-E Gaming WiFi",
    descripcion: "Motherboard AM5 de gama alta con soporte PCIe 5.0 y fases de alimentación robustas.",
    precio: 620000,
    stock: 4,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWX3bfpju9Pa0yZXJIJ1Ur4ULqeO3o-YktB6dDt4NibRDy-3WA09S55UPJ-elnLyW_Z3Dv_APKww1Eeu4vP4A0A7o9f0fQ_3zEgs9F4hUJWTIVRBEMBAJp9HVoO05Ak6lX-D73idAYZ7BlvyvWOPClrcPn_CwwkqT5S28S2mdO5RrmsyH7hOIiwaIBN__g9r_rL-MRgxGyiDSDpJI2sSXnbJe2SGCjaXACvtfvK0K7hCCEwA4E4FKy",
    public_id: "asus-rog-x670e",
    created_at: new Date().toISOString(),
    categoria: "Mothers",
    subcategoria: "ASUS",
    subcategoria_id: 7,
    caracteristicas: [{ clave: "Socket", valor: "AM5" }]
  },
  {
    id: "8",
    nombre: "ASUS ROG Swift OLED PG27AQDM 27\"",
    descripcion: "Monitor de gaming OLED de 27 pulgadas con resolución QHD y tasa de refresco de 240Hz.",
    precio: 1150000,
    stock: 3,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
    public_id: "asus-rog-oled-27",
    created_at: new Date().toISOString(),
    categoria: "Monitores",
    subcategoria: "ASUS",
    subcategoria_id: 8,
    caracteristicas: [{ clave: "Panel", valor: "OLED QHD" }]
  },
  {
    id: "9",
    nombre: "Auriculares HyperX Cloud III Wireless",
    descripcion: "Sonido inmersivo con hasta 120 horas de batería y micrófono ultra nítido.",
    precio: 185000,
    stock: 12,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlOKdgRAKO7axgPLoIgkCRBAIPe6bsUaBE8vP6H9Bvv-GKDMIu_rSFc0qyF7ezSYtLOY5R6GacDs31OXReUXhA4UG-RhNp0_lQHPyACkypX7peSe8m2Peb8moXxODRAzR4vnS1UsctLGRF5z2BQv0AsqMIJc_4r7lc1Ql_c-APM9BPWmXqDZ0NUSZxKJFP45-LQW2J48oNiUfZ9AvpdpifNc7mBHIFM0Qq5suWwe6pjS1-mqSxzKwi",
    public_id: "hyperx-cloud-3-wireless",
    created_at: new Date().toISOString(),
    categoria: "Periféricos",
    subcategoria: "HyperX",
    subcategoria_id: 9,
    caracteristicas: [{ clave: "Conexión", valor: "Wireless 2.4GHz" }]
  },
  {
    id: "10",
    nombre: "Teclado Mecánico Razer Huntsman V3 Pro TKL",
    descripcion: "Teclado con switches analógicos ópticos de segunda generación y modo rapid trigger.",
    precio: 295000,
    stock: 7,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWX3bfpju9Pa0yZXJIJ1Ur4ULqeO3o-YktB6dDt4NibRDy-3WA09S55UPJ-elnLyW_Z3Dv_APKww1Eeu4vP4A0A7o9f0fQ_3zEgs9F4hUJWTIVRBEMBAJp9HVoO05Ak6lX-D73idAYZ7BlvyvWOPClrcPn_CwwkqT5S28S2mdO5RrmsyH7hOIiwaIBN__g9r_rL-MRgxGyiDSDpJI2sSXnbJe2SGCjaXACvtfvK0K7hCCEwA4E4FKy",
    public_id: "razer-huntsman-v3-tkl",
    created_at: new Date().toISOString(),
    categoria: "Periféricos",
    subcategoria: "Razer",
    subcategoria_id: 10,
    caracteristicas: [{ clave: "Switches", valor: "Analógicos Ópticos" }]
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(4);
  const [gapPx, setGapPx] = useState(24);

  const touchStartX = useRef<number | null>(null);

  // Filtrar solo productos con stock disponible (> 0)
  const productosDisponibles = productos.filter((p) => p.stock > 0);
  const totalItems = productosDisponibles.length;

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

  return (
    <section className="w-full py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Header con Controles del Carrusel (Estilo Categorías) */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-black text-ink tracking-tight">
            Productos <span className="text-primary font-black">destacados</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Anterior slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Siguiente slide"
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
          {productosDisponibles.map((producto) => (
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

export default SeccionDestacados;
