import {IDataResponse} from './data-response.interface';

export interface ISalida {
  id: number;
  ordenVentaId: number;
  fecha: string;
  tipo: 'Venta' | 'Merma' | 'Devolución' | 'Ajuste' | 'Donación';
  productos: ISalidaDetalle[];
  total: number;
  usuarioId: number;
  usuarioNombre: string;
  observaciones?: string;
  comprobanteId?: string;
}

export interface ISalidaDetalle {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precio: number;
}

export interface ISalidaResponse extends IDataResponse {
  data: ISalida[];
}
