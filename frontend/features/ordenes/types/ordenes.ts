import { DatosFacturacion } from "@/features/usuario/types/usuarios";

export type EstadoOrden = "PENDIENTE" | "PAGADO" | "ENVIADO" | "COMPLETADA" | "CANCELADA";

export interface OrdenInput {
  productos: {
    id: string;
    cantidad: number;
  }[];
}

export interface ProductoDetalleOrden {
  nombre: string;
  cantidad: number;
  precio_unitario: number | string;
}

export interface Orden {
  id: string;
  estado: EstadoOrden;
  total: number | string;
  created_at: string;
  usuario_nombre: string;
  usuario_email?: string;
  productos: ProductoDetalleOrden[];
}

export type InitPoint = {
  init_point: string;
};

export interface DatosFacturacionOrdenProps {
  formData: DatosFacturacion;
  onChange: (field: keyof DatosFacturacion, value: string) => void;
  fieldErrors?: Partial<Record<keyof DatosFacturacion, boolean>>;
  tieneDatosFacturacion?: boolean;
  guardarEnPerfil?: boolean;
  onToggleGuardarEnPerfil?: (checked: boolean) => void;
}

export interface ResumenCheckoutProps {
  onPagar?: () => void;
  loading?: boolean;
  disabled?: boolean;
  textoBoton?: string;
  subtextoBoton?: string;
}