import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ICrearOrden, IOrdenResponse} from '../modules/ordenes/interfaces/orden.interface';
import {environment} from "../../environments/environment";
import {IDataResponse} from "../shared/interfaces/data-response.interface";

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private apiUrl = `${environment.API_URL}/orden`;
  private readonly http = inject(HttpClient)

  getOrdenes(): Observable<IOrdenResponse> {
    return this.http.get<IOrdenResponse>(this.apiUrl);
  }

  crearOrdenCompra(orden: ICrearOrden): Observable<IDataResponse> {
    return this.http.post<IDataResponse>(`${this.apiUrl}/compra`, orden);
  }

  getOrdenById(id: number): Observable<IOrdenResponse> {
    return this.http.get<IOrdenResponse>(`${this.apiUrl}/${id}`);
  }
}

