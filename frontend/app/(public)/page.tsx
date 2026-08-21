"use client";

import { useState, useEffect } from "react";
import { Header } from "@/shared/components/layout/Header";
import { Beneficios } from "@/shared/components/layout/Beneficios";
import { Footer } from "@/shared/components/layout/Footer";
import { Categorias } from "@/shared/components/home/Categorias";
import { SeccionDestacados } from "@/features/productos/components/SeccionDestacados";
import { SeccionOfertas } from "@/features/productos/components/SeccionOfertas";
import { SeccionNvidia } from "@/features/productos/components/SeccionNvidia";
import { JsonLd } from "@/shared/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Banners del Hero Carousel
const HERO_BANNERS = [
  {
    id: 1,
    title: "NVIDIA GeForce RTX 40 Series - Potencia Absoluta",
    image: "/banners/hero1.png",
    link: "/productos?categoria=Placas+de+Video",
  },
  {
    id: 2,
    title: "Procesadores AMD Ryzen 7000 - Rendimiento Next-Gen",
    image: "/banners/hero2.png",
    link: "/productos?busqueda=Ryzen",
  },
  {
    id: 3,
    title: "Armá tu PC Gamer a Medida con Garantía Oficial",
    image: "/banners/hero3.png",
    link: "/productos",
  },
];

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "NexusPC",
      url: SITE_URL,
      logo: `${SITE_URL}/banners/hero1.png`,
      description:
        "Tienda líder en hardware gamer, componentes de computación y PCs armadas con el mejor precio y garantía en Argentina.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "NexusPC",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/productos?busqueda={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

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
      {/* Datos Estructurados Schema.org */}
      <JsonLd data={homeStructuredData} />

      {/* Header Modular */}
      <Header />

      {/* Spacer responsivo para header fijo (64px en mobile, 112px en desktop) */}
      <div className="pt-16 sm:pt-[112px]"></div>

      {/* HERO CAROUSEL */}
      <section className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-6">
        <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border shadow-md group bg-slate-950">
          {/* Slide Link */}
          <a
            href={HERO_BANNERS[currentSlide].link}
            className="relative block w-full h-[180px] xs:h-[220px] sm:h-[340px] md:h-[400px] lg:h-[460px] overflow-hidden"
          >
            <img
              src={HERO_BANNERS[currentSlide].image}
              alt={HERO_BANNERS[currentSlide].title}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent"></div>
          </a>

          {/* Controls */}
          <button
            onClick={prevSlide}
            aria-label="Anterior"
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-ink/70 hover:bg-primary text-surface flex items-center justify-center backdrop-blur-xs border border-surface/20 transition-all opacity-80 hover:opacity-100 shadow-md cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Siguiente"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-ink/70 hover:bg-primary text-surface flex items-center justify-center backdrop-blur-xs border border-surface/20 transition-all opacity-80 hover:opacity-100 shadow-md cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-10 bg-ink/60 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-surface/10">
            {HERO_BANNERS.map((banner, index) => (
              <button
                key={banner.id}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-5 sm:w-7 bg-primary"
                    : "w-2 sm:w-2.5 bg-surface/50 hover:bg-surface"
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <Beneficios />

      {/* PRODUCTOS EN OFERTA */}
      <SeccionOfertas />

      {/* CATEGORÍAS */}
      <Categorias
        selectedCategoryId={selectedCategory}
        onSelectCategory={(id) => setSelectedCategory(id)}
      />

      {/* SECCIÓN BRAND NVIDIA */}
      <SeccionNvidia />

      {/* PRODUCTOS DESTACADOS */}
      <SeccionDestacados />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}