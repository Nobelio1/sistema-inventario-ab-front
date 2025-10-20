import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {NuevaOrdenModal} from "./components/nueva-orden-modal/nueva-orden-modal";
import {OrdenesService} from "../../api/ordenes.service";
import {IOrdenes} from "./interfaces/orden.interface";

@Component({
  selector: 'app-ordenes',
  imports: [CommonModule, NuevaOrdenModal],
  templateUrl: './ordenes.html',
  styles: ``
})
export class Ordenes implements OnInit {
  public readonly title = signal('ORDENES');
  public ordenes = signal<IOrdenes[]>([]);
  public mostrarModal = signal(false);

  private readonly ordenesService = inject(OrdenesService)

  ngOnInit() {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.ordenesService.getOrdenes().subscribe({
      next: (res) => {
        const {data, success, message} = res;
        if (!success) {
          console.error(message)
          return
        }
        this.ordenes.set(data);
      },
      error: (error) => {
        console.error('Error al cargar órdenes:', error);
      }
    });
  }

  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  onOrdenCreada() {
    this.cargarOrdenes();
  }

  formatearFecha(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }
}
