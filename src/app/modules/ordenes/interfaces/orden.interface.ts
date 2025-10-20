import {IDataResponse} from "../../../shared/interfaces/data-response.interface";

export interface IProveedorSelect {
  id: number;
  nombre: string;
}

export interface IProveedorSelectResponse extends IDataResponse{
  data: IProveedorSelect[];
}

export interface IProducto {
  id: number;
  nombre: string;
  precio: number;
  stock?: number;
}

export interface IProductoSelectResponse extends IDataResponse{
  data: IProducto[];
}

export interface IDetalleOrden {
  idProducto: number;
  cantidad: number;
}

export interface ICrearOrden {
  idUsuario: number;
  idProveedor: number;
  fechaOrden: string;
  detalleOrden: IDetalleOrden[];
}

export interface IOrdenes {
  id: number;
  tipo: string;
  fecha: string;
  estado: string;
  creador: string;
  total: number;
}

export interface IOrdenResponse extends IDataResponse{
  orden: IOrdenes[];
}
