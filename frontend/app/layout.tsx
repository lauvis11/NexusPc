import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusPc",
  description: "E-commerce de componentes y equipos de PC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
