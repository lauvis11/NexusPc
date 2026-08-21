import type { Metadata } from "next";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { ProductoPricing } from "@/features/productos/components/ProductoPricing";
import { Especificaciones } from "@/features/productos/components/Especificaciones";
import { ProductosRelacionados } from "@/features/productos/components/ProductosRelacionados";
import { getProductoIndividual } from "@/features/productos/api/productos";
import { JsonLd } from "@/shared/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const producto = await getProductoIndividual(id);

  if (!producto) {
    return {
      title: "Producto no encontrado",
      description: "El producto que estás buscando no existe o ya no está disponible.",
    };
  }

  const descripcionLimpia =
    producto.descripcion ||
    `Comprá ${producto.nombre} al mejor precio con garantía oficial en NexusPC.`;

  return {
    title: producto.nombre,
    description: descripcionLimpia.slice(0, 160),
    keywords: [
      producto.nombre,
      producto.categoria,
      producto.subcategoria || "",
      "comprar",
      "precio",
      "argentina",
      "nexuspc",
    ].filter(Boolean),
    alternates: {
      canonical: `${SITE_URL}/productos/${producto.id}`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/productos/${producto.id}`,
      title: `${producto.nombre} | NexusPC`,
      description: descripcionLimpia.slice(0, 160),
      images: [
        {
          url: producto.img_url,
          width: 800,
          height: 800,
          alt: producto.nombre,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${producto.nombre} | NexusPC`,
      description: descripcionLimpia.slice(0, 160),
      images: [producto.img_url],
    },
  };
}

export default async function ProductoIndividualPage({ params }: PageProps) {
  const { id } = await params;
  const producto = await getProductoIndividual(id);

  if (!producto) {
    notFound();
  }

  const precioFinal = producto.precio_oferta || producto.precio;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    image: [producto.img_url],
    description: producto.descripcion || producto.nombre,
    sku: producto.id,
    brand: {
      "@type": "Brand",
      name: producto.subcategoria || producto.categoria || "NexusPC",
    },
    category: producto.categoria,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/productos/${producto.id}`,
      priceCurrency: "ARS",
      price: precioFinal,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability:
        producto.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "NexusPC",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catálogo",
        item: `${SITE_URL}/productos`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: producto.nombre,
        item: `${SITE_URL}/productos/${producto.id}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      {/* Datos Estructurados Schema.org */}
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

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
