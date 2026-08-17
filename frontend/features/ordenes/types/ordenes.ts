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
  productos: ProductoDetalleOrden[];
}

export type InitPoint = {
  init_point: string;
};