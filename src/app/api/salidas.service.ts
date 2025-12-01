import {inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {LocalStorageService} from '../shared/services/local-storage.service';
import {ISalida, ISalidaResponse} from '../shared/interfaces/salida.interface';
import {IDataResponse} from '../shared/interfaces/data-response.interface';
import {ProductosService} from './productos.service';
import {MovimientosService} from './movimientos.service';

@Injectable({
  providedIn: 'root'
})
export class SalidasService {
  private readonly localStorage = inject(LocalStorageService);
  private readonly productosService = inject(ProductosService);
  private readonly movimientosService = inject(MovimientosService);

  getSalidas(): Observable<ISalidaResponse> {
    const salidas = this.localStorage.get<ISalida>('salidas') as ISalida[];
    return of({
      success: true,
      message: 'Salidas obtenidas correctamente',
      data: salidas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    });
  }

  registrarSalida(salida: Omit<ISalida, 'id'>): Observable<IDataResponse> {
    // Validar stock disponible
    for (const detalle of salida.productos) {
      const productoObs = this.productosService.getProductoById(detalle.productoId);
      let hayStock = true;

      productoObs.subscribe(res => {
        const producto = res.data[0];
        if (producto && producto.stock < detalle.cantidad) {
          hayStock = false;
        }
      });

      if (!hayStock) {
        return of({
          success: false,
          message: `Stock insuficiente para el producto`
        });
      }
    }

    // Generar ID de comprobante
    const comprobante = this.generarComprobanteId();
    const nuevaSalida: Omit<ISalida, 'id'> = {
      ...salida,
      comprobanteId: comprobante
    };

    this.localStorage.add<ISalida>('salidas', nuevaSalida);

    // Actualizar stock y registrar movimientos
    salida.productos.forEach(detalle => {
      this.productosService.actualizarStock(detalle.productoId, detalle.cantidad, 'resta');

      this.movimientosService.registrarMovimiento({
        tipo: 'Salida',
        fecha: salida.fecha,
        productoId: detalle.productoId,
        productoNombre: detalle.productoNombre,
        cantidad: detalle.cantidad,
        motivo: salida.tipo,
        usuarioId: salida.usuarioId,
        usuarioNombre: salida.usuarioNombre,
        referencia: comprobante
      }).subscribe();
    });

    return of({
      success: true,
      message: 'Salida registrada correctamente'
    });
  }

  private generarComprobanteId(): string {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const salidas = this.localStorage.get<ISalida>('salidas') as ISalida[];
    const numero = String(salidas.length + 1).padStart(5, '0');
    return `CS-${año}-${mes}-${numero}`;
  }
}
