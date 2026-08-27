export interface CaracteristicaInput {
  clave: string;
  valor: string;
}

export interface ProductoInput {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  img_url: string;
  public_id: string;
  categoria_id: number;
  subcategoria_id?: number | null;
  destacado?: boolean;
  caracteristicas: CaracteristicaInput[];
}

export type PartialProductoInput = Partial<Omit<ProductoInput, 'caracteristicas'>>