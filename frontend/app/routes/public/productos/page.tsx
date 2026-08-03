"use client";

import { useState } from "react";
import { Header } from "../../../shared/components/layout/Header";
import { Footer } from "../../../shared/components/layout/Footer";
import { ProductoCard } from "../../../features/productos/components/ProductoCard";
import {
  FiltroCategorias,
  FiltrosState,
} from "../../../features/productos/components/FiltroCategorias";
import type { Producto } from "../../../features/productos/types/types";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
} from "lucide-react";

// Mock Data de 12 Productos para el Catálogo
const MOCK_CATALOGO: Producto[] = [
  {
    id: "p1",
    nombre: "NVIDIA GeForce RTX 4070 OC 12GB",
    descripcion: "Potencia absoluta en Ray Tracing y gráficos acelerados por IA.",
    precio: 1299000,
    precioOferta: 999000,
    stock: 8,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWX3bfpju9Pa0yZXJIJ1Ur4ULqeO3o-YktB6dDt4NibRDy-3WA09S55UPJ-elnLyW_Z3Dv_APKww1Eeu4vP4A0A7o9f0fQ_3zEgs9F4hUJWTIVRBEMBAJp9HVoO05Ak6lX-D73idAYZ7BlvyvWOPClrcPn_CwwkqT5S28S2mdO5RrmsyH7hOIiwaIBN__g9r_rL-MRgxGyiDSDpJI2sSXnbJe2SGCjaXACvtfvK0K7hCCEwA4E4FKy",
    public_id: "rtx-4070",
    created_at: new Date().toISOString(),
    categoria: "Tarjetas Gráficas",
    subcategoria: "NVIDIA",
    subcategoria_id: 1,
    caracteristicas: [{ clave: "Memoria", valor: "12GB GDDR6X" }],
  },
  {
    id: "p2",
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
    caracteristicas: [{ clave: "Núcleos", valor: "8 Cores / 16 Threads" }],
  },
  {
    id: "p3",
    nombre: "Corsair Dominator 32GB (2x16GB) DDR5 6000MHz",
    descripcion: "Memoria RAM DDR5 ultra rápida optimizada para overclocking.",
    precio: 359000,
    precioOferta: 279000,
    stock: 5,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlOKdgRAKO7axgPLoIgkCRBAIPe6bsUaBE8vP6H9Bvv-GKDMIu_rSFc0qyF7ezSYtLOY5R6GacDs31OXReUXhA4UG-RhNp0_lQHPyACkypX7peSe8m2Peb8moXxODRAzR4vnS1UsctLGRF5z2BQv0AsqMIJc_4r7lc1Ql_c-APM9BPWmXqDZ0NUSZxKJFP45-LQW2J48oNiUfZ9AvpdpifNc7mBHIFM0Qq5suWwe6pjS1-mqSxzKwi",
    public_id: "dominator-32gb-ddr5",
    created_at: new Date().toISOString(),
    categoria: "Memorias RAM",
    subcategoria: "Corsair",
    subcategoria_id: 3,
    caracteristicas: [{ clave: "Velocidad", valor: "6000 MT/s" }],
  },
  {
    id: "p4",
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
    caracteristicas: [{ clave: "Capacidad", valor: "2TB" }],
  },
  {
    id: "p5",
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
    id: "p6",
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
    id: "p7",
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
    caracteristicas: [{ clave: "Tamaño", valor: "360mm" }],
  },
  {
    id: "p8",
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
    caracteristicas: [{ clave: "Tipo", valor: "Mid Tower" }],
  },
  {
    id: "p9",
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
    caracteristicas: [{ clave: "Socket", valor: "AM5" }],
  },
  {
    id: "p10",
    nombre: "ASUS ROG Swift OLED PG27AQDM 27\"",
    descripcion: "Monitor de gaming OLED de 27 pulgadas con resolución QHD y tasa de refresco de 240Hz.",
    precio: 1150000,
    precioOferta: 890000,
    stock: 3,
    img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
    public_id: "asus-rog-oled-27",
    created_at: new Date().toISOString(),
    categoria: "Monitores",
    subcategoria: "ASUS",
    subcategoria_id: 8,
    caracteristicas: [{ clave: "Panel", valor: "OLED QHD" }],
  },
  {
    id: "p11",
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
    caracteristicas: [{ clave: "Conexión", valor: "Wireless 2.4GHz" }],
  },
  {
    id: "p12",
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
    caracteristicas: [{ clave: "Switches", valor: "Analógicos Ópticos" }],
  },
];

export default function ProductosPage() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Estado unificado de filtros sopotado por GET /productos
  const [filtros, setFiltros] = useState<FiltrosState>({
    categoria: null,
    subcategoria_id: null,
    precio_min: "",
    precio_max: "",
    en_stock: false,
  });

  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      {/* Header Modular */}
      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Banner Superior / Header de Página */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 pb-4 border-b border-border/50">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
              Catálogo de <span className="text-primary font-black">Productos</span>
            </h1>
          </div>

          {/* Acciones: Filtros mobile & Selector Ordenar */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Botón Filtros — Solo visible en Mobile */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-xs font-bold text-ink hover:border-primary transition-all cursor-pointer shadow-2xs"
            >
              {filtros.categoria ? (
                <SlidersHorizontal className="w-4 h-4 text-primary" />
              ) : (
                <Layers className="w-4 h-4 text-primary" />
              )}
              <span>{filtros.categoria ? "Filtros Activos" : "Categorías"}</span>
            </button>

            {/* Selector Ordenar */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline text-xs font-semibold text-ink-secondary uppercase tracking-wider">
                Ordenar:
              </span>
              <select className="bg-surface border border-border rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-ink focus:border-primary outline-none cursor-pointer shadow-2xs">
                <option>Relevancia</option>
                <option>Precio: Menor a Mayor</option>
                <option>Precio: Mayor a Menor</option>
                <option>Más recientes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Componente FiltroCategorias + Grilla de Productos */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── SIDEBAR FILTROS (Desktop) ─────────────────────────── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-surface p-5 rounded-2xl border border-border shadow-2xs">
              <FiltroCategorias
                filtros={filtros}
                onChangeFiltros={setFiltros}
              />
            </div>
          </aside>

          {/* ── CANVAS PRINCIPAL: Grilla de Productos ───────────── */}
          <section className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {MOCK_CATALOGO.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-border/50">
              <button className="w-9 h-9 rounded-xl border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-xl bg-primary text-surface font-bold text-xs">
                1
              </button>
              <button className="w-9 h-9 rounded-xl border border-border bg-surface text-ink hover:border-primary hover:text-primary font-bold text-xs cursor-pointer">
                2
              </button>
              <button className="w-9 h-9 rounded-xl border border-border bg-surface text-ink hover:border-primary hover:text-primary font-bold text-xs cursor-pointer">
                3
              </button>
              <button className="w-9 h-9 rounded-xl border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

        </div>
      </main>

      {/* ── MOBILE FILTROS DRAWER ───────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-80 max-w-full h-full bg-surface shadow-2xl flex flex-col z-10 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <h3 className="font-black text-ink text-lg tracking-tight flex items-center gap-2">
                {filtros.categoria ? (
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                ) : (
                  <Layers className="w-5 h-5 text-primary" />
                )}
                <span>{filtros.categoria ? "Filtros" : "Categorías"}</span>
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-ink-secondary hover:text-primary rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Árbol y Filtros en Mobile */}
            <FiltroCategorias
              filtros={filtros}
              onChangeFiltros={setFiltros}
              showHeader={false}
            />

            <div className="pt-4 border-t border-border/50 flex items-center gap-3 mt-auto">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-primary text-surface font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
