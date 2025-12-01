import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { IProducto, IProductoResponse } from '../shared/interfaces/producto.interface';
import { IDataResponse } from '../shared/interfaces/data-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private readonly localStorage = inject(LocalStorageService);

  getProductos(): Observable<IProductoResponse> {
    const productos = this.localStorage.get<IProducto>('productos');
    return of({
      success: true,
      message: 'Productos obtenidos correctamente',
      data: productos as IProducto[]
    });
  }

  getProductoById(id: number): Observable<IProductoResponse> {
    const producto = this.localStorage.getById<IProducto>('productos', id);
    return of({
      success: !!producto,
      message: producto ? 'Producto encontrado' : 'Producto no encontrado',
      data: producto ? [producto] : []
    });
  }

  crearProducto(producto: Omit<IProducto, 'id'>): Observable<IDataResponse> {
    this.localStorage.add<IProducto>('productos', producto);
    return of({
      success: true,
      message: 'Producto creado correctamente'
    });
  }

  actualizarProducto(producto: IProducto): Observable<IDataResponse> {
    this.localStorage.update('productos', producto);
    return of({
      success: true,
      message: 'Producto actualizado correctamente'
    });
  }

  eliminarProducto(id: number): Observable<IDataResponse> {
    this.localStorage.delete('productos', id);
    return of({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  }

  getProductosStockBajo(): Observable<IProductoResponse> {
    const productos = this.localStorage.get<IProducto>('productos') as IProducto[];
    const stockBajo = productos.filter(p => p.stock <= p.stockMinimo);
    return of({
      success: true,
      message: 'Productos con stock bajo',
      data: stockBajo
    });
  }

  actualizarStock(id: number, cantidad: number, tipo: 'suma' | 'resta'): void {
    const producto = this.localStorage.getById<IProducto>('productos', id);
    if (producto) {
      producto.stock = tipo === 'suma'
        ? producto.stock + cantidad
        : producto.stock - cantidad;
      this.localStorage.update('productos', producto);
    }
  }
}
