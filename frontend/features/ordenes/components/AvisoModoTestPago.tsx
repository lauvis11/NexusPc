"use client";

import { useState } from "react";
import {
  CreditCard,
  UserCheck,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
} from "lucide-react";
import { MERCADO_PAGO_DEMO_CONFIG } from "../constants/mercadoPagoDemo";

interface CopiedState {
  [key: string]: boolean;
}

export function AvisoModoTestPago() {
  const [copiedState, setCopiedState] = useState<CopiedState>({});
  const [showPassword, setShowPassword] = useState(false);

  const { buyerAccount, testCard, docUrl } = MERCADO_PAGO_DEMO_CONFIG;

  const handleCopy = async (fieldKey: string, valueToCopy: string) => {
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopiedState((prev) => ({ ...prev, [fieldKey]: true }));
      setTimeout(() => {
        setCopiedState((prev) => ({ ...prev, [fieldKey]: false }));
      }, 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = valueToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedState((prev) => ({ ...prev, [fieldKey]: true }));
      setTimeout(() => {
        setCopiedState((prev) => ({ ...prev, [fieldKey]: false }));
      }, 2000);
    }
  };

  return (
    <section
      aria-label="Credenciales e instrucciones de prueba"
      className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-surface to-primary-tint/30 p-5 sm:p-6 shadow-sm space-y-5 animate-in fade-in duration-200"
    >
      {/* ── ENCABEZADO DESTACADO ─────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
        <AlertCircle className="w-8 h-8 sm:w-9 sm:h-9 text-amber-500 shrink-0" strokeWidth={2.2} />
        <h2 className="text-base sm:text-lg font-black text-ink tracking-tight">
          Cuenta y Código de prueba
        </h2>
      </div>

      {/* ── CUENTA TEST Y TARJETA TEST (UNO DEBAJO DEL OTRO) ───────── */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* 1. CUENTA COMPRADORA DE PRUEBA */}
        <div className="rounded-xl border-2 border-slate-300 bg-surface p-4 sm:p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary shrink-0" />
              <h3 className="text-xs sm:text-sm font-extrabold text-ink tracking-tight">
                Cuenta Compradora de Prueba
              </h3>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Usuario de prueba */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
                Usuario de Prueba
              </label>
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-alt border border-border">
                <span className="font-mono text-xs sm:text-sm font-semibold text-ink select-all truncate">
                  {buyerAccount.email}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy("email", buyerAccount.email)}
                  title={copiedState["email"] ? "¡Copiado!" : "Copiar usuario"}
                  aria-label="Copiar usuario de prueba"
                  className="group p-1.5 text-ink-secondary hover:text-primary transition-all duration-150 active:scale-75 cursor-pointer shrink-0 inline-flex items-center justify-center"
                >
                  {copiedState["email"] ? (
                    <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in-50 duration-200" />
                  ) : (
                    <Copy className="w-4 h-4 transition-transform group-hover:scale-110" />
                  )}
                </button>
              </div>
            </div>

            {/* Contraseña de prueba */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
                Contraseña
              </label>
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-alt border border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-ink select-all">
                    {showPassword ? buyerAccount.password : "••••••••••••"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    className="text-ink-secondary hover:text-ink p-1 rounded transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("password", buyerAccount.password)}
                  title={copiedState["password"] ? "¡Copiado!" : "Copiar contraseña"}
                  aria-label="Copiar contraseña"
                  className="group p-1.5 text-ink-secondary hover:text-primary transition-all duration-150 active:scale-75 cursor-pointer shrink-0 inline-flex items-center justify-center"
                >
                  {copiedState["password"] ? (
                    <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in-50 duration-200" />
                  ) : (
                    <Copy className="w-4 h-4 transition-transform group-hover:scale-110" />
                  )}
                </button>
              </div>
            </div>

            {/* Código de verificación (2FA) */}
            {buyerAccount.codigoVerificacion && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
                    Código de Verificación (2FA)
                  </label>
                  <span className="text-[10px] text-primary font-bold">Por si MP lo solicita</span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-alt border border-border">
                  <span className="font-mono text-xs sm:text-sm font-bold text-ink tracking-widest select-all">
                    {buyerAccount.codigoVerificacion}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy("codigo", buyerAccount.codigoVerificacion || "")}
                    title={copiedState["codigo"] ? "¡Copiado!" : "Copiar código"}
                    aria-label="Copiar código de verificación"
                    className="group p-1.5 text-ink-secondary hover:text-primary transition-all duration-150 active:scale-75 cursor-pointer shrink-0 inline-flex items-center justify-center"
                  >
                    {copiedState["codigo"] ? (
                      <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in-50 duration-200" />
                    ) : (
                      <Copy className="w-4 h-4 transition-transform group-hover:scale-110" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mensaje Destacado: Asegurar inicio de sesión con cuenta de test y no personal */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/15 border-2 border-amber-500/50 dark:border-amber-500/40 text-ink shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" strokeWidth={2.4} />
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                Importante
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-ink leading-relaxed">
              Asegúrate de haber iniciado sesión en Mercado Pago con la <strong className="font-extrabold text-amber-600 dark:text-amber-300">cuenta de prueba indicada arriba</strong> y <strong className="font-extrabold text-red-600 dark:text-red-400 underline underline-offset-2">NUNCA con tu cuenta personal</strong>. Si tu navegador tiene tu cuenta real abierta, ciérrala antes de continuar.
            </p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-slate-300 bg-surface p-4 sm:p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="text-xs sm:text-sm font-extrabold text-ink tracking-tight">
                Tarjetas de Prueba Guardadas
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              Ya precargadas
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
              Código de Seguridad (CVV / CVC)
            </label>
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-alt border border-border">
              <span className="font-mono text-xs sm:text-sm font-bold text-ink tracking-widest select-all">
                {testCard.cvc}
              </span>
              <button
                type="button"
                onClick={() => handleCopy("cvc", testCard.cvc)}
                title={copiedState["cvc"] ? "¡Copiado!" : "Copiar código CVC"}
                aria-label="Copiar código CVC"
                className="group p-1.5 text-ink-secondary hover:text-primary transition-all duration-150 active:scale-75 cursor-pointer shrink-0 inline-flex items-center justify-center"
              >
                {copiedState["cvc"] ? (
                  <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in-50 duration-200" />
                ) : (
                  <Copy className="w-4 h-4 transition-transform group-hover:scale-110" />
                )}
              </button>
            </div>
          </div>

          {/* Contenedor explicativo sin borde y bien definido */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-alt/90 shadow-2xs">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-[12px] text-ink-secondary leading-relaxed">
              Al seleccionar cualquiera de las tarjetas de prueba guardadas en la cuenta de test, Mercado Pago solo te pedirá el código de seguridad: escribe <strong className="font-bold text-ink font-mono bg-surface px-1.5 py-0.5 rounded shadow-2xs">{testCard.cvc}</strong> para completar el pago.
            </p>
          </div>
        </div>
      </div>

      {/* ── PIE: ENLACE A DOCUMENTACIÓN ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-amber-500/20 text-xs">
        <span className="text-ink-secondary text-center sm:text-left">
          ¿Deseas consultar tarjetas de prueba adicionales?
        </span>
        <a
          href={docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-bold text-primary hover:text-primary-hover underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Documentación oficial de Mercado Pago</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
