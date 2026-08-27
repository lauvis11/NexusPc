import {
  Clock,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export type EstadoOrdenTipo =
  | "PENDIENTE"
  | "PAGADO"
  | "APROBADO"
  | "ENVIADO"
  | "EN_ENVIO"
  | "EN CAMINO"
  | "COMPLETADA"
  | "ENTREGADO"
  | "CANCELADA"
  | "CANCELADO"
  | "RECHAZADO"
  | string;

interface EstadoBadgeProps {
  estado: EstadoOrdenTipo;
  variant?: "pill" | "text";
  className?: string;
}

export function EstadoBadge({
  estado,
  variant = "pill",
  className = "",
}: EstadoBadgeProps) {
  const estadoUpper = (estado || "").toUpperCase();

  switch (estadoUpper) {
    case "ENTREGADO":
    case "COMPLETADA":
      if (variant === "text") {
        return (
          <span className={`inline-flex items-center gap-1.5 text-emerald-600 text-xs font-extrabold ${className}`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{estadoUpper === "ENTREGADO" ? "Entregado" : "Completada"}</span>
          </span>
        );
      }
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-success border border-success/40 bg-transparent ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Completada</span>
        </span>
      );

    case "APROBADO":
    case "PAGADO":
      if (variant === "text") {
        return (
          <span className={`inline-flex items-center gap-1.5 text-emerald-600 text-xs font-extrabold ${className}`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Pagado</span>
          </span>
        );
      }
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-primary border border-primary/40 bg-transparent ${className}`}
        >
          <CreditCard className="w-3.5 h-3.5 shrink-0" />
          <span>Pagado</span>
        </span>
      );

    case "EN_ENVIO":
    case "ENVIADO":
    case "EN CAMINO":
      if (variant === "text") {
        return (
          <span className={`inline-flex items-center gap-1.5 text-blue-600 text-xs font-extrabold ${className}`}>
            <Truck className="w-4 h-4 shrink-0" />
            <span>En camino</span>
          </span>
        );
      }
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-secondary border border-secondary/40 bg-transparent ${className}`}
        >
          <Truck className="w-3.5 h-3.5 shrink-0" />
          <span>Enviado</span>
        </span>
      );

    case "CANCELADO":
    case "CANCELADA":
    case "RECHAZADO":
      if (variant === "text") {
        return (
          <span className={`inline-flex items-center gap-1.5 text-rose-600 text-xs font-extrabold ${className}`}>
            <XCircle className="w-4 h-4 shrink-0" />
            <span>Cancelado</span>
          </span>
        );
      }
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-danger border border-danger/40 bg-transparent ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Cancelada</span>
        </span>
      );

    case "PENDIENTE":
    default:
      if (variant === "text") {
        return (
          <span className={`inline-flex items-center gap-1.5 text-amber-600 text-xs font-extrabold ${className}`}>
            <Clock className="w-4 h-4 shrink-0" />
            <span>Pendiente</span>
          </span>
        );
      }
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-warning border border-warning/40 bg-transparent ${className}`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Pendiente</span>
        </span>
      );
  }
}
