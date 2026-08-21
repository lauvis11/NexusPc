import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { SITE_URL } from "@/lib/constants";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NexusPC | Componentes informáticos y Gaming Hardware",
    template: "%s | NexusPC",
  },
  description:
    "Tu tienda especialista en hardware, placas de video, procesadores y PCs armadas con el mejor precio y garantía oficial en Argentina.",
  keywords: [
    "hardware gamer",
    "placas de video",
    "procesadores ryzen",
    "placas nvidia",
    "pc gamer argentina",
    "componentes de pc",
    "gaming hardware",
    "nexuspc",
  ],
  authors: [{ name: "NexusPC" }],
  creator: "NexusPC",
  publisher: "NexusPC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "NexusPC",
    title: "NexusPC | Componentes informáticos y Gaming Hardware",
    description:
      "Tu tienda especialista en hardware, placas de video, procesadores y PCs armadas con el mejor precio y garantía oficial en Argentina.",
    images: [
      {
        url: "/banners/hero1.png",
        width: 1200,
        height: 630,
        alt: "NexusPC Gaming Hardware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusPC | Componentes informáticos y Gaming Hardware",
    description:
      "Tu tienda especialista en hardware, placas de video, procesadores y PCs armadas con el mejor precio y garantía oficial en Argentina.",
    images: ["/banners/hero1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="font-sans bg-surface-alt text-ink antialiased min-h-screen flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
