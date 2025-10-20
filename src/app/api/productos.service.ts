import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IProductoSelectResponse} from '../modules/ordenes/interfaces/orden.interface';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = `${environment.API_URL}/producto`;
  private readonly http = inject(HttpClient)

  getProductos(): Observable<IProductoSelectResponse> {
    return this.http.get<IProductoSelectResponse>(`${this.apiUrl}/compra`);
  }
}
