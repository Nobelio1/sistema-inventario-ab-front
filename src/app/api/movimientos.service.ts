import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { IMovimiento, IMovimientoResponse } from '../shared/interfaces/movimiento.interface';
import { IDataResponse } from '../shared/interfaces/data-response.interface';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  private readonly localStorage = inject(LocalStorageService);

  getMovimientos(): Observable<IMovimientoResponse> {
    const movimientos = this.localStorage.get<IMovimiento>('movimientos');
    return of({
      success: true,
      message: 'Movimientos obtenidos correctamente',
      data: movimientos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    });
  }

  registrarMovimiento(movimiento: Omit<IMovimiento, 'id'>): Observable<IDataResponse> {
    this.localStorage.add('movimientos', movimiento);
    return of({
      success: true,
      message: 'Movimiento registrado correctamente'
    });
  }

  getMovimientosPorProducto(productoId: number): Observable<IMovimientoResponse> {
    const movimientos = this.localStorage.get<IMovimiento>('movimientos');
    const filtrados = movimientos.filter(m => m.productoId === productoId);
    return of({
      success: true,
      message: 'Movimientos del producto',
      data: filtrados
    });
  }

  getMovimientosPorFecha(fechaInicio: string, fechaFin: string): Observable<IMovimientoResponse> {
    const movimientos = this.localStorage.get<IMovimiento>('movimientos');
    const filtrados = movimientos.filter(m => {
      const fecha = new Date(m.fecha);
      return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
    });
    return of({
      success: true,
      message: 'Movimientos en el rango de fechas',
      data: filtrados
    });
  }
}
