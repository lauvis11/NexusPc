export interface OfertasInput {
    producto_id: string
    tipo: 'porcentaje' | 'monto_fijo'
    valor: number
    fecha_inicio: string
    fecha_fin: string
    activo?: boolean
}

export interface Oferta {
  id: number;
  producto_id: string;
  tipo: 'porcentaje' | 'monto_fijo';
  valor: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export type PartialOfertaInput = Partial<OfertasInput>