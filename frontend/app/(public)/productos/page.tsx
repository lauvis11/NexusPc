import { Suspense } from "react";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { Catalogo } from "@/features/productos/components/Catalogo";

export default function ProductosPage() {
  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Suspense>
          <Catalogo />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
