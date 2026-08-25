"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ShoppingCart,
  Truck,
  ShieldCheck,
  PackageCheck,
  Plus,
  Minus,
} from "lucide-react";
import type { Producto } from "../types/types";
import { estaEnOferta } from "../utils/ofertaUtils";
import { useCarritoStore } from "@/features/carrito/store/store";
import { formatearPrecio } from "@/shared/utils/format";

interface ProductoPricingProps {
  producto: Producto;
  onAddToCart?: (producto: Producto, cantidad: number) => void;
}

export function ProductoPricing({
  producto,
  onAddToCart,
}: ProductoPricingProps) {
  const router = useRouter();
  const agregarProducto = useCarritoStore((state) => state.agregarProducto);
  const [cantidad, setCantidad] = useState(1);

  // Galería de imágenes (usa img_url principal + miniaturas de muestra)
  const imagenes = [
    producto.img_url,
    "https://lh3.googleusercontent.com/aida-public/AB6AXuASzu7gFFgKou7QDYgZkRHVkakmtr2ekMU4dcw6X4iX7vhc6npxuvYiG0jnXxmJeTma3BvrAC_PuZUguJeFt2x8emWRAhVJSiicW8QCrgp3Daq00TSjBLDw8dhwstHC5hfelxG1xtLW886oKjxLy2FNFyq3CXnkZHufGElKdtNvy19dyw2L0rwuiTKsRweE-CpO-xXLXO-i-WsGmuewGz0Ed3KIcXsT0GRc1yk_kBdzcoA2rc3FOjgH",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC9Ql14hhgVvLrrAUFHdS-7W1JgyewRgrHeH2TftJbqLDZrnQYzx-gLoQj--BJCR5rLN8LvVQm9KksQC2Xu5nz8iQ95nB0RQ7HwrrdY6ItN92kl6kDQOou3GUeUX-COmEejyAJwnN-mS8wBKClURYlWAVE33RnYIrAmKJPozVh5vYNkQNOFAM6q8pLrfwhPzGD6fcWnn9EH5AQYnen_VmtJsDqvQrjZpOLuCGZubJDk1SBZvRi9HZxY",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDoL_g_6SdsqJYltSB_NfzRS9Anp8-GrL8qBVgyr3_Ts47_D4Vlk15V3LuQ14toxzo-L1hSJNNu3t1cGtGHC8CXiyaVEEMaZ1_eOyQkowIIJlCYUxQpOi3AcJsp9pLs0jjNYEvgdOjk4vdltgKvTttNyfNarwpLm3NiFS6ENg6CzTjxoye7wInigxA5K9VhOT-2vKKoEG6dgnA65QHJJCJKIPXZbz9GP1NjeLygewM7f53yMJSbrRWG",
  ];

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  const enOferta = estaEnOferta(producto);
  const descuento = enOferta
    ? Number(producto.precio) - Number(producto.precio_oferta!)
    : 0;

  const marca = (
    producto.subcategoria ||
    producto.nombre.split(" ")[0] ||
    "NEXUS"
  ).toUpperCase();

  const handleIncrement = () => {
    if (cantidad < producto.stock) setCantidad((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (cantidad > 1) setCantidad((prev) => prev - 1);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── BREADCRUMBS ────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-secondary font-medium overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-primary transition-colors">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-ink-secondary/60 shrink-0" />
        <Link href="/productos" className="hover:text-primary transition-colors">
          {producto.categoria || "Productos"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-ink-secondary/60 shrink-0" />
        <span className="text-ink font-bold truncate max-w-[200px] sm:max-w-xs">
          {producto.nombre}
        </span>
      </nav>

      {/* ── PRODUCT HERO SECTION ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* GALERÍA DE IMÁGENES (LG: 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Imagen Principal */}
          <div className="relative bg-surface border border-border/80 rounded-2xl p-6 sm:p-10 flex justify-center items-center h-[340px] sm:h-[460px] shadow-2xs overflow-hidden group">
            {enOferta && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-primary text-white text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Ahorras {formatearPrecio(descuento)}
                </span>
              </div>
            )}
            <Image
              src={imagenes[selectedImgIndex] || producto.img_url || "/placeholder-product.png"}
              alt={producto.nombre}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Miniaturas de la Galería */}
          <div className="grid grid-cols-4 gap-3">
            {imagenes.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImgIndex(idx)}
                className={`relative bg-surface border-2 rounded-xl p-2 flex justify-center items-center h-20 sm:h-24 cursor-pointer transition-all overflow-hidden ${
                  selectedImgIndex === idx
                    ? "border-primary shadow-sm scale-102"
                    : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img || "/placeholder-product.png"}
                  alt={`Vista ${idx + 1}`}
                  fill
                  sizes="100px"
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>

        {/* INFORMACIÓN DE PRECIO Y COMPRA (LG: 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6 bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-2xs">
          <div>
            <span className="text-xs font-extrabold text-ink-secondary/70 uppercase tracking-widest block mb-1">
              {marca}
            </span>

            <h1 className="text-xl sm:text-3xl font-black text-ink tracking-tight leading-snug">
              {producto.nombre}
            </h1>
          </div>

          {/* Sección de Precio */}
          <div className="border-y border-border/60 py-4 space-y-1">
            {enOferta ? (
              <div className="space-y-1">
                <span className="text-sm text-ink-secondary/70 line-through leading-none block">
                  {formatearPrecio(producto.precio)}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
                    {formatearPrecio(producto.precio_oferta!)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Precio oferta
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
                  {formatearPrecio(producto.precio)}
                </span>
                <span className="text-xs font-semibold text-ink-secondary block mt-0.5">
                  Precio contado
                </span>
              </div>
            )}
            <p className="text-xs text-ink-secondary pt-1">
              IVA incluido. Envíos calculados en el checkout.
            </p>
          </div>

          {/* ── STOCK, ENVÍO Y GARANTÍA APILADOS DEBAJO DEL PRECIO ── */}
          <div className="flex flex-col gap-2">
            {/* Estado de Stock */}
            <div className="flex items-center gap-3 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <PackageCheck className={`w-5 h-5 shrink-0 ${producto.stock > 0 ? "text-emerald-600" : "text-red-500"}`} />
              <span className={`font-bold text-xs ${producto.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>
                {producto.stock > 0 ? "En Stock" : "Sin Stock"}
              </span>
            </div>

            {/* Envío Asegurado */}
            <div className="flex items-center gap-3 p-2.5 bg-surface-alt/60 border border-border/40 rounded-xl">
              <Truck className="w-5 h-5 text-primary shrink-0" />
              <span className="font-bold text-xs text-ink">Envío Asegurado</span>
            </div>

            {/* Garantía Oficial */}
            <div className="flex items-center gap-3 p-2.5 bg-surface-alt/60 border border-border/40 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <span className="font-bold text-xs text-ink">Garantía Oficial NexusPC</span>
            </div>
          </div>

          {/* Selector de Cantidad */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-secondary block">
              Cantidad
            </label>
            <div className="flex items-center border border-border rounded-xl w-fit bg-surface-alt/50 overflow-hidden">
              <button
                onClick={handleDecrement}
                disabled={cantidad <= 1}
                className="px-3.5 py-2 hover:bg-surface text-ink disabled:opacity-30 transition-colors cursor-pointer"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-extrabold text-sm text-ink">
                {cantidad}
              </span>
              <button
                onClick={handleIncrement}
                disabled={cantidad >= producto.stock}
                className="px-3.5 py-2 hover:bg-surface text-ink disabled:opacity-30 transition-colors cursor-pointer"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="space-y-3 pt-1">
            <button
              onClick={() => {
                if (producto.stock > 0) {
                  agregarProducto(producto, cantidad);
                  onAddToCart && onAddToCart(producto, cantidad);
                }
              }}
              disabled={producto.stock <= 0}
              className="w-full py-3.5 px-6 bg-primary text-surface font-extrabold text-sm sm:text-base rounded-xl hover:bg-primary-hover active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Agregar al Carrito</span>
            </button>

            <button
              onClick={() => {
                if (producto.stock > 0) {
                  agregarProducto(producto, cantidad);
                  router.push("/carrito");
                }
              }}
              disabled={producto.stock <= 0}
              className="w-full py-3 px-6 bg-primary-tint text-primary border border-primary/30 font-bold text-xs sm:text-sm rounded-xl hover:bg-primary hover:text-surface transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center block"
            >
              Comprar Ahora
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductoPricing;
