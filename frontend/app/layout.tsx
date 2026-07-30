import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexusPC | Componentes informáticos y Gaming Hardware",
  description: "Tu tienda especialista en hardware, placas de video, procesadores y PCs armadas con el mejor precio y garantía.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="font-sans bg-surface-alt text-ink antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
