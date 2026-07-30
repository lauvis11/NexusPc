import { Truck, CreditCard, ShieldCheck, Headphones } from "lucide-react";

export function Beneficios() {
  return (
    <section className="bg-surface border-b border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-5 p-4 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-primary-tint text-primary flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-ink text-base sm:text-lg leading-snug">Envíos a todo el país</h4>
              <p className="text-sm text-ink-secondary mt-0.5">Despacho express en 24hs</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-4 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-primary-tint text-primary flex items-center justify-center shrink-0 shadow-xs">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-ink text-base sm:text-lg leading-snug">12 Cuotas Fijas</h4>
              <p className="text-sm text-ink-secondary mt-0.5">Aceptamos todas las tarjetas</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-4 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-primary-tint text-primary flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-ink text-base sm:text-lg leading-snug">Garantía Directa 1 Año</h4>
              <p className="text-sm text-ink-secondary mt-0.5">Soporte directo oficial</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-4 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-primary-tint text-primary flex items-center justify-center shrink-0 shadow-xs">
              <Headphones className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-ink text-base sm:text-lg leading-snug">Asesoramiento Gamer</h4>
              <p className="text-sm text-ink-secondary mt-0.5">Especialistas en armado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Beneficios;