import {IDataResponse} from './data-response.interface';

export interface IMovimiento {
  id?: number;
  tipo: 'Entrada' | 'Salida' | 'Ajuste';
  fecha: string;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  motivo: string;
  usuarioId: number;
  usuarioNombre: string;
  referencia?: string;
}

export interface IMovimientoResponse extends IDataResponse {
  data: IMovimiento[];
}
