"use client";

interface SeccionSkeletonProps {
  titulo?: string;
  subtituloHighlight?: string;
  count?: number;
}

export function SeccionSkeleton({
  titulo,
  subtituloHighlight,
  count = 4,
}: SeccionSkeletonProps) {
  return (
    <section className="w-full py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
        {titulo ? (
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-ink tracking-tight">
              {titulo}{" "}
              {subtituloHighlight && (
                <span className="text-primary font-black">
                  {subtituloHighlight}
                </span>
              )}
            </h2>
          </div>
        ) : (
          <div className="h-8 w-56 bg-slate-200 rounded-lg animate-pulse" />
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 animate-pulse" />
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </div>

      {/* Grid / Carrusel Skeleton */}
      <div className="flex gap-3 sm:gap-6 py-2 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-[calc((100%-12px)/2.25)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3*1.5rem)/4)] shrink-0 h-72 sm:h-96 bg-surface border border-border rounded-xl sm:rounded-2xl animate-pulse flex flex-col p-3 sm:p-5 shadow-2xs"
          >
            {/* Imagen Skeleton */}
            <div className="h-36 sm:h-56 w-full bg-slate-200 rounded-lg sm:rounded-xl mb-3" />
            {/* Marca & Título Skeleton */}
            <div className="space-y-2">
              <div className="h-3 w-16 bg-slate-200 rounded" />
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
            </div>
            {/* Precio & Botón Skeleton */}
            <div className="mt-auto pt-2 flex justify-between items-center">
              <div className="space-y-1.5">
                <div className="h-5 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-14 bg-slate-200 rounded" />
              </div>
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-200 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
