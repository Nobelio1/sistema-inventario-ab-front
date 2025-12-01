import {IDataResponse} from './data-response.interface';

export interface IUsuario {
  id?: number;
  nombre: string;
  email: string;
  rol: string;
  usuario: string;
  estado: string;
}

export interface IUsuarioResponse extends IDataResponse {
  data: IUsuario[];
}
