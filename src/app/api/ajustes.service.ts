import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { IAjuste, IAjusteResponse } from '../shared/interfaces/ajuste.interface';
import { IDataResponse } from '../shared/interfaces/data-response.interface';
import { ProductosService } from './productos.service';
import { MovimientosService } from './movimientos.service';

@Injectable({
  providedIn: 'root'
})
export class AjustesService {
  private readonly localStorage = inject(LocalStorageService);
  private readonly productosService = inject(ProductosService);
  private readonly movimientosService = inject(MovimientosService);

  getAjustes(): Observable<IAjusteResponse> {
    const ajustes = this.localStorage.get<IAjuste>('ajustes');
    return of({
      success: true,
      message: 'Ajustes obtenidos correctamente',
      data: ajustes
    });
  }

  registrarAjuste(ajuste: Omit<IAjuste, 'id'>): Observable<IDataResponse> {
    // Actualizar stock del producto
    this.productosService.getProductoById(ajuste.productoId).subscribe(res => {
      const producto = res.data[0];
      if (producto) {
        producto.stock = ajuste.cantidadNueva;
        this.productosService.actualizarProducto(producto).subscribe();
      }
    });

    // Registrar ajuste
    this.localStorage.add('ajustes', ajuste);

    // Registrar movimiento
    this.movimientosService.registrarMovimiento({
      tipo: 'Ajuste',
      fecha: ajuste.fecha,
      productoId: ajuste.productoId,
      productoNombre: ajuste.productoNombre,
      cantidad: Math.abs(ajuste.diferencia),
      motivo: ajuste.motivo,
      usuarioId: ajuste.usuarioId,
      usuarioNombre: ajuste.usuarioNombre,
      referencia: ajuste.justificacion
    }).subscribe();

    return of({
      success: true,
      message: 'Ajuste registrado correctamente'
    });
  }
}
