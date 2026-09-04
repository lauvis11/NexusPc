"use client";

import { useEffect } from "react";
import { AlertCircle, X, ArrowRight } from "lucide-react";

interface ModalAvisoTestProps {
  isOpen: boolean;
  onClose: () => void;
  onContinuar: () => void;
}

export function ModalAvisoTest({ isOpen, onClose, onContinuar }: ModalAvisoTestProps) {
  // Cerrar al presionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-aviso-test-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-ink-secondary hover:text-ink p-1.5 rounded-lg hover:bg-surface-alt transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contenido del aviso centrado */}
        <div className="space-y-3.5 text-center">
          {/* Título con Ícono alineados */}
          <div className="flex items-center justify-center gap-3">
            <div className="text-amber-500 shrink-0">
              <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.4} />
            </div>
            <h3 id="modal-aviso-test-title" className="text-xl sm:text-2xl font-black text-ink tracking-tight">
              El siguiente paso es el pago
            </h3>
          </div>

          {/* Textos centrados con ancho reducido */}
          <div className="space-y-2 max-w-sm mx-auto">
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
              Esta página está en <strong className="text-ink font-bold">modo de test</strong>, por lo cual los pagos son simulados y <strong className="text-ink font-bold">no se debitará dinero real ni se enviarán pedidos</strong>.
            </p>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
              En el siguiente paso tendrás a disposición los datos de una cuenta para pruebas y la tarjeta autorizada para simular la compra en Mercado Pago.
            </p>
          </div>
        </div>

        {/* Botones de acción centrados y más juntos */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-center gap-3 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-border bg-surface hover:bg-surface-alt text-ink-secondary hover:text-ink font-bold text-sm transition-colors cursor-pointer text-center"
          >
            Volver a revisar datos
          </button>

          <button
            type="button"
            onClick={onContinuar}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer text-center"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
