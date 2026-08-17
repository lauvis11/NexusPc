export interface OrdenInput {
  productos: {
    id: string;
    cantidad: number;
  }[];
}

export type InitPoint = {
  init_point: string;
};