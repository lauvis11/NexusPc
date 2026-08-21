import { MetadataRoute } from "next";
import { API_URL, SITE_URL } from "@/lib/constants";
import type { ProductosResponse } from "@/features/productos/types/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ayuda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const res = await fetch(`${API_URL}/productos?limit=1000`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return staticRoutes;

    const data: ProductosResponse = await res.json();
    const productos = data.data || [];

    const productRoutes: MetadataRoute.Sitemap = productos.map((prod) => ({
      url: `${SITE_URL}/productos/${prod.id}`,
      lastModified: prod.created_at ? new Date(prod.created_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
