import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { IProveedor, IProveedorResponse } from '../shared/interfaces/proveedor.interface';
import { IDataResponse } from '../shared/interfaces/data-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private readonly localStorage = inject(LocalStorageService);

  getProveedores(): Observable<IProveedorResponse> {
    const proveedores = this.localStorage.get<IProveedor>('proveedores');
    return of({
      success: true,
      message: 'Proveedores obtenidos correctamente',
      data: proveedores
    });
  }

  crearProveedor(proveedor: IProveedor): Observable<IDataResponse> {
    this.localStorage.add('proveedores', proveedor);
    return of({
      success: true,
      message: 'Proveedor creado correctamente'
    });
  }

  actualizarProveedor(proveedor: IProveedor): Observable<IDataResponse> {
    this.localStorage.update('proveedores', proveedor);
    return of({
      success: true,
      message: 'Proveedor actualizado correctamente'
    });
  }

  eliminarProveedor(id: number): Observable<IDataResponse> {
    this.localStorage.delete<IProveedor>('proveedores', id);
    return of({
      success: true,
      message: 'Proveedor eliminado correctamente'
    });
  }
}
