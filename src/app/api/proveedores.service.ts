import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IProveedorSelectResponse} from '../modules/ordenes/interfaces/orden.interface';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private apiUrl = `${environment.API_URL}/proveedor`;
  private readonly http = inject(HttpClient)

  getProveedores(): Observable<IProveedorSelectResponse> {
    return this.http.get<IProveedorSelectResponse>(this.apiUrl);
  }
}

