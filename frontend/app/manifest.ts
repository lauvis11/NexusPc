import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NexusPC - E-commerce de Hardware y Gaming",
    short_name: "NexusPC",
    description:
      "Tu tienda especialista en hardware, placas de video, procesadores y PCs armadas con el mejor precio y garantía.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#10b981",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
