import {IDataResponse} from './data-response.interface';

export interface IProducto {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  ubicacion: string;
  estado: string;
  fechaVencimiento?: string;
  proveedor?: string;
}

export interface IProductoResponse extends IDataResponse {
  data: IProducto[];
}
