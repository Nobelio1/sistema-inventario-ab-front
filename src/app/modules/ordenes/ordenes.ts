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
      next: (data) => {
        const {orden, success, message} = data;
        if (!success) {
          console.error(message)
          return
        }
        this.ordenes.set(orden);
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
}
