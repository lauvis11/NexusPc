"use client";

import { useState } from "react";
import {
  CreditCard,
  UserCheck,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
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
          Cuenta y Tarjeta de prueba
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

          <p className="text-[11px] text-ink-secondary leading-relaxed bg-surface-alt/70 p-2.5 rounded-lg border border-border/60">
            <span className="font-bold text-ink">Importante:</span> Al ingresar a Mercado Pago, inicia sesión con este usuario o usa la tarjeta de prueba de abajo.
          </p>
        </div>

        {/* 2. TARJETA DE PRUEBA (PAGO APROBADO) */}
        <div className="rounded-xl border-2 border-slate-300 bg-surface p-4 sm:p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="text-xs sm:text-sm font-extrabold text-ink tracking-tight">
                Tarjeta de Prueba (Aprobada)
              </h3>
            </div>
          </div>

          {/* Datos de la Tarjeta */}
          <div className="space-y-2.5">
            {/* Número de tarjeta */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
                Número de Tarjeta
              </label>
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-alt border border-border">
                <span className="font-mono text-xs sm:text-sm font-bold text-ink tracking-wider select-all">
                  {testCard.numero}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy("numero", testCard.numero.replace(/\s+/g, ""))}
                  title={copiedState["numero"] ? "¡Copiado!" : "Copiar número de tarjeta"}
                  aria-label="Copiar número de tarjeta"
                  className="group p-1.5 text-ink-secondary hover:text-primary transition-all duration-150 active:scale-75 cursor-pointer shrink-0 inline-flex items-center justify-center"
                >
                  {copiedState["numero"] ? (
                    <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in-50 duration-200" />
                  ) : (
                    <Copy className="w-4 h-4 transition-transform group-hover:scale-110" />
                  )}
                </button>
              </div>
            </div>

            {/* Fila con Vencimiento, CVC y Titular */}
            <div className="grid grid-cols-3 gap-2">
              {/* Vencimiento */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary truncate block">
                  Vence
                </label>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-alt border border-border">
                  <span className="font-mono text-xs font-bold text-ink select-all">
                    {testCard.fechaVencimiento}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy("fecha", testCard.fechaVencimiento)}
                    title={copiedState["fecha"] ? "¡Copiado!" : "Copiar fecha de vencimiento"}
                    aria-label="Copiar fecha de vencimiento"
                    className="group p-1 text-ink-secondary hover:text-primary transition-all duration-150 active:scale-75 cursor-pointer shrink-0 inline-flex items-center justify-center"
                  >
                    {copiedState["fecha"] ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-50 duration-200" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                    )}
                  </button>
                </div>
              </div>

              {/* CVC */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary truncate block">
                  CVC / CVV
                </label>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-alt border border-border">
                  <span className="font-mono text-xs font-bold text-ink select-all">
                    {testCard.cvc}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy("cvc", testCard.cvc)}
                    title={copiedState["cvc"] ? "¡Copiado!" : "Copiar código CVC"}
                    aria-label="Copiar código CVC"
                    className="group p-1 text-ink-secondary hover:text-primary transition-all duration-150 active:scale-75 cursor-pointer shrink-0 inline-flex items-center justify-center"
                  >
                    {copiedState["cvc"] ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-50 duration-200" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                    )}
                  </button>
                </div>
              </div>

              {/* Titular */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary truncate block">
                  Titular
                </label>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-alt border border-border">
                  <span className="font-mono text-xs font-bold text-ink select-all truncate">
                    {testCard.titular}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy("titular", testCard.titular)}
                    title={copiedState["titular"] ? "¡Copiado!" : "Copiar nombre del titular"}
                    aria-label="Copiar nombre del titular"
                    className="group p-1 text-ink-secondary hover:text-primary transition-all duration-150 active:scale-75 cursor-pointer shrink-0 inline-flex items-center justify-center"
                  >
                    {copiedState["titular"] ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-50 duration-200" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-ink-secondary leading-relaxed bg-surface-alt/70 p-2.5 rounded-lg border border-border/60">
            El titular <span className="font-bold text-ink font-mono">{testCard.titular}</span> le indica a Mercado Pago que apruebe automáticamente la operación.
          </p>
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
