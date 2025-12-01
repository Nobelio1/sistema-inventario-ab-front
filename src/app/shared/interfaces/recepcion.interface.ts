import {IDataResponse} from './data-response.interface';

export interface IRecepcion {
  id?: number;
  ordenCompraId: number;
  proveedorId: number;
  proveedorNombre: string;
  fecha: string;
  productos: IRecepcionDetalle[];
  usuarioId: number;
  usuarioNombre: string;
  estado: 'Pendiente' | 'Completada';
  observaciones?: string;
}

export interface IRecepcionDetalle {
  productoId: number;
  productoNombre: string;
  cantidadEsperada: number;
  cantidadRecibida: number;
  ubicacion: string;
}

export interface IRecepcionResponse extends IDataResponse {
  data: IRecepcion[];
}
