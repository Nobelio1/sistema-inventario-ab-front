import {IDataResponse} from './data-response.interface';

export interface IProveedor {
  id?: number;
  nombre: string;
  ruc: string;
  telefono: string;
  email: string;
  direccion: string;
  estado: string;
}

export interface IProveedorResponse extends IDataResponse {
  data: IProveedor[];
}
