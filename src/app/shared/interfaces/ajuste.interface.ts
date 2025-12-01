import {IDataResponse} from './data-response.interface';

export interface IAjuste {
  id?: number;
  fecha: string;
  productoId: number;
  productoNombre: string;
  cantidadAnterior: number;
  cantidadNueva: number;
  diferencia: number;
  motivo: string;
  justificacion: string;
  usuarioId: number;
  usuarioNombre: string;
}

export interface IAjusteResponse extends IDataResponse {
  data: IAjuste[];
}
