"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductoCard } from "./ProductoCard";
import type { Producto } from "../types/types";

// Mock Data de productos para filtrado por categoría
const MOCK_RELACIONADOS: Producto[] = [
  {
    id: "rel-1",
    nombre: "Intel Core i7-14700K Processor",
    descripcion: "20 núcleos y 28 hilos para gaming de alta frecuencia y productividad.",
    precio: 720000,
    precioOferta: 599000,
    stock: 7,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
    public_id: "i7-14700k",
    created_at: new Date().toISOString(),
    categoria: "Procesadores",
    subcategoria: "Intel",
    subcategoria_id: 2,
    caracteristicas: [{ clave: "Núcleos", valor: "20C / 28T" }],
  },
  {
    id: "rel-2",
    nombre: "AMD Ryzen 9 7950X3D Processor",
    descripcion: "16 núcleos masivos con tecnología 3D V-Cache para creadores y gamers entusiastas.",
    precio: 1150000,
    stock: 5,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
    public_id: "ryzen-7950x3d",
    created_at: new Date().toISOString(),
    categoria: "Procesadores",
    subcategoria: "AMD",
    subcategoria_id: 2,
    caracteristicas: [{ clave: "Núcleos", valor: "16C / 32T" }],
  },
  {
    id: "rel-3",
    nombre: "AMD Ryzen 5 7600X Processor",
    descripcion: "Rendimiento gaming AM5 accesible de 6 núcleos a 5.3GHz Turbo.",
    precio: 340000,
    precioOferta: 289000,
    stock: 10,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
    public_id: "ryzen-7600x",
    created_at: new Date().toISOString(),
    categoria: "Procesadores",
    subcategoria: "AMD",
    subcategoria_id: 2,
    caracteristicas: [{ clave: "Núcleos", valor: "6C / 12T" }],
  },
  {
    id: "rel-4",
    nombre: "Intel Core i5-14600K Processor",
    descripcion: "Excelente relación precio/rendimiento con 14 núcleos de potencia híbrida.",
    precio: 480000,
    stock: 9,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
    public_id: "i5-14600k",
    created_at: new Date().toISOString(),
    categoria: "Procesadores",
    subcategoria: "Intel",
    subcategoria_id: 2,
    caracteristicas: [{ clave: "Núcleos", valor: "14C / 20T" }],
  },
  {
    id: "rel-5",
    nombre: "AMD Ryzen 9 7900X Processor",
    descripcion: "12 núcleos de pura potencia Zen 4 para renders y multitarea pesada.",
    precio: 890000,
    precioOferta: 749000,
    stock: 6,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
    public_id: "ryzen-7900x",
    created_at: new Date().toISOString(),
    categoria: "Procesadores",
    subcategoria: "AMD",
    subcategoria_id: 2,
    caracteristicas: [{ clave: "Núcleos", valor: "12C / 24T" }],
  },
];

interface ProductosRelacionadosProps {
  categoria: string;
  productoIdActual?: string;
  productos?: Producto[];
  onAddToCart?: (producto: Producto) => void;
}

export function ProductosRelacionados({
  categoria,
  productoIdActual,
  productos = MOCK_RELACIONADOS,
  onAddToCart,
}: ProductosRelacionadosProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(4);
  const [gapPx, setGapPx] = useState(24);

  const touchStartX = useRef<number | null>(null);

  // Filtrar productos por la misma categoría y excluir el producto actual
  const productosFiltrados = productos.filter((p) => {
    const mismaCategoria =
      !categoria || p.categoria.toLowerCase() === categoria.toLowerCase();
    const diferenteId = !productoIdActual || p.id !== productoIdActual;
    return mismaCategoria && diferenteId && p.stock > 0;
  });

  const totalItems = productosFiltrados.length;

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

  if (productosFiltrados.length === 0) return null;

  return (
    <section className="w-full py-8 sm:py-12 border-t border-border/60 overflow-hidden">
      {/* Header con título y controles del carrusel */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-black text-ink tracking-tight">
            Productos <span className="text-primary font-black">relacionados</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Anterior relacionado"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Siguiente relacionado"
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
          {productosFiltrados.map((producto) => (
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

export default ProductosRelacionados;
