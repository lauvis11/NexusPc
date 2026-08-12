import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { ProductoPricing } from "@/features/productos/components/ProductoPricing";
import { Especificaciones } from "@/features/productos/components/Especificaciones";
import { ProductosRelacionados } from "@/features/productos/components/ProductosRelacionados";
import { getProductoIndividual } from "@/features/productos/api/productos";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoIndividualPage({ params }: PageProps) {
  const { id } = await params;
  const producto = await getProductoIndividual(id);

  if (!producto) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      {/* Header Modular */}
      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        {/* Componente Primera Sección: Pricing & Galería */}
        <ProductoPricing producto={producto} />

        {/* Componente Segunda Sección: Especificaciones & Descripción (Pestañas) */}
        <Especificaciones
          caracteristicas={producto.caracteristicas}
          descripcion={producto.descripcion}
          nombre={producto.nombre}
        />

        {/* Componente Tercera Sección: Productos Relacionados (Misma Categoría) */}
        <ProductosRelacionados
          categoria={producto.categoria}
          productoIdActual={producto.id}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
