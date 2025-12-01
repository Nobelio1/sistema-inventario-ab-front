import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICrearOrden, IOrdenResponse, IOrdenes } from '../modules/ordenes/interfaces/orden.interface';
import { IDataResponse } from "../shared/interfaces/data-response.interface";
import { LocalStorageService } from '../shared/services/local-storage.service';
import { ProductosService } from './productos.service';
import { MovimientosService } from './movimientos.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private readonly localStorage = inject(LocalStorageService);
  private readonly productosService = inject(ProductosService);
  private readonly movimientosService = inject(MovimientosService);

  getOrdenes(): Observable<IOrdenResponse> {
    const ordenes = this.localStorage.get<IOrdenes>('ordenes');
    return of({
      success: true,
      message: 'Órdenes obtenidas correctamente',
      data: ordenes
    });
  }

  crearOrdenCompra(orden: ICrearOrden): Observable<IDataResponse> {
    const nuevaOrden: IOrdenes = {
      id: 0, // Se asignará automáticamente
      tipo: 'Compra',
      fecha: orden.fechaOrden,
      estado: 'Pendiente',
      creador: 'Usuario',
      total: 0 // Se calculará
    };

    // Calcular total
    let total = 0;
    this.productosService.getProductos().subscribe(res => {
      orden.detalleOrden.forEach(detalle => {
        const producto = res.data.find(p => p.id === detalle.idProducto);
        if (producto) {
          total += producto.precio * detalle.cantidad;
        }
      });
      nuevaOrden.total = total;
    });

    this.localStorage.add('ordenes', nuevaOrden);

    return of({
      success: true,
      message: 'Orden creada correctamente'
    });
  }

  getOrdenById(id: number): Observable<IOrdenResponse> {
    const orden = this.localStorage.getById<IOrdenes>('ordenes', id);
    return of({
      success: !!orden,
      message: orden ? 'Orden encontrada' : 'Orden no encontrada',
      data: orden ? [orden] : []
    });
  }
}
