import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { IRecepcion, IRecepcionResponse } from '../shared/interfaces/recepcion.interface';
import { IDataResponse } from '../shared/interfaces/data-response.interface';
import { ProductosService } from './productos.service';
import { MovimientosService } from './movimientos.service';

@Injectable({
  providedIn: 'root'
})
export class RecepcionesService {
  private readonly localStorage = inject(LocalStorageService);
  private readonly productosService = inject(ProductosService);
  private readonly movimientosService = inject(MovimientosService);

  getRecepciones(): Observable<IRecepcionResponse> {
    const recepciones = this.localStorage.get<IRecepcion>('recepciones');
    return of({
      success: true,
      message: 'Recepciones obtenidas correctamente',
      data: recepciones
    });
  }

  iniciarRecepcion(recepcion: Omit<IRecepcion, 'id'>): Observable<IDataResponse> {
    this.localStorage.add('recepciones', recepcion);
    return of({
      success: true,
      message: 'Recepción iniciada correctamente'
    });
  }

  completarRecepcion(id: number, productos: IRecepcion['productos']): Observable<IDataResponse> {
    const recepcion = this.localStorage.getById<IRecepcion>('recepciones', id);

    if (!recepcion) {
      return of({
        success: false,
        message: 'Recepción no encontrada'
      });
    }

    // Actualizar productos y stock
    productos.forEach(detalle => {
      this.productosService.actualizarStock(
        detalle.productoId,
        detalle.cantidadRecibida,
        'suma'
      );

      // Actualizar ubicación si es necesario
      this.productosService.getProductoById(detalle.productoId).subscribe(res => {
        const producto = res.data[0];
        if (producto && detalle.ubicacion) {
          producto.ubicacion = detalle.ubicacion;
          this.productosService.actualizarProducto(producto).subscribe();
        }
      });

      // Registrar movimiento
      this.movimientosService.registrarMovimiento({
        tipo: 'Entrada',
        fecha: new Date().toISOString(),
        productoId: detalle.productoId,
        productoNombre: detalle.productoNombre,
        cantidad: detalle.cantidadRecibida,
        motivo: 'Recepción de compra',
        usuarioId: recepcion.usuarioId,
        usuarioNombre: recepcion.usuarioNombre,
        referencia: `OC-${recepcion.ordenCompraId}`
      }).subscribe();
    });

    // Actualizar estado de recepción
    recepcion.estado = 'Completada';
    recepcion.productos = productos;
    this.localStorage.update('recepciones', recepcion);

    return of({
      success: true,
      message: 'Recepción completada correctamente'
    });
  }
}
