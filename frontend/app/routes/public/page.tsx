"use client";

import { useState, useEffect } from "react";
import { Header } from "../../shared/components/layout/Header";
import { Beneficios } from "../../shared/components/layout/Beneficios";
import { Footer } from "../../shared/components/layout/Footer";
import { Categorias } from "../../shared/components/home/Categorias";
import { SeccionDestacados } from "../../features/productos/components/SeccionDestacados";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Banners del Hero Carousel
const HERO_BANNERS = [
  {
    id: 1,
    title: "NVIDIA GeForce RTX 40 Series - Potencia Absoluta",
    image: "/banners/hero1.png",
    link: "#productos",
  },
  {
    id: 2,
    title: "Procesadores AMD Ryzen 7000 - Rendimiento Next-Gen",
    image: "/banners/hero2.png",
    link: "#productos",
  },
  {
    id: 3,
    title: "Armá tu PC Gamer a Medida con Garantía Oficial",
    image: "/banners/hero3.png",
    link: "#arma-tu-pc",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Rotación automática cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  };

  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      {/* Header Modular */}
      <Header />
      <div className="pt-[112px]"></div>

      {/* HERO CAROUSEL */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative w-full overflow-hidden rounded-2xl border border-border shadow-lg group bg-slate-900">
          {/* Slide Link */}
          <a
            href={HERO_BANNERS[currentSlide].link}
            className="relative block w-full h-[220px] sm:h-[340px] md:h-[400px] lg:h-[460px] overflow-hidden"
          >
            <img
              src={HERO_BANNERS[currentSlide].image}
              alt={HERO_BANNERS[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent"></div>
          </a>

          {/* Controls */}
          <button
            onClick={prevSlide}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink/70 hover:bg-primary text-surface flex items-center justify-center backdrop-blur-xs border border-surface/20 transition-all opacity-80 hover:opacity-100 shadow-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink/70 hover:bg-primary text-surface flex items-center justify-center backdrop-blur-xs border border-surface/20 transition-all opacity-80 hover:opacity-100 shadow-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-ink/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-surface/10">
            {HERO_BANNERS.map((banner, index) => (
              <button
                key={banner.id}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-7 bg-primary"
                    : "w-2.5 bg-surface/50 hover:bg-surface"
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <Beneficios />

      {/* PRODUCTOS DESTACADOS */}
      <SeccionDestacados />

      {/* CATEGORÍAS (Usando el JSON de tu API) */}
      <Categorias
        selectedCategoryId={selectedCategory}
        onSelectCategory={(id) => setSelectedCategory(id)}
      />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}