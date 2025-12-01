import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { IUsuario, IUsuarioResponse } from '../shared/interfaces/usuario.interface';
import { IDataResponse } from '../shared/interfaces/data-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly localStorage = inject(LocalStorageService);

  getUsuarios(): Observable<IUsuarioResponse> {
    const usuarios = this.localStorage.get<IUsuario>('usuarios');
    return of({
      success: true,
      message: 'Usuarios obtenidos correctamente',
      data: usuarios
    });
  }

  crearUsuario(usuario: IUsuario): Observable<IDataResponse> {
    this.localStorage.add('usuarios', usuario);
    return of({
      success: true,
      message: 'Usuario creado correctamente'
    });
  }

  actualizarUsuario(usuario: IUsuario): Observable<IDataResponse> {
    this.localStorage.update('usuarios', usuario);
    return of({
      success: true,
      message: 'Usuario actualizado correctamente'
    });
  }

  eliminarUsuario(id: number): Observable<IDataResponse> {
    this.localStorage.delete<IUsuario>('usuarios', id);
    return of({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  }
}
