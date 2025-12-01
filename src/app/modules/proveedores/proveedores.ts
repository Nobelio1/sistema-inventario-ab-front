import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedoresService } from '../../api/proveedores.service';
import { IProveedor } from '../../shared/interfaces/proveedor.interface';
import { LucideAngularModule, Plus, Edit, Trash2, Phone, Mail } from 'lucide-angular';
import { NuevoProveedorModal } from './components/nuevo-proveedor-modal/nuevo-proveedor-modal';

@Component({
  selector: 'app-proveedores',
  imports: [CommonModule, FormsModule, LucideAngularModule, NuevoProveedorModal],
  templateUrl: './proveedores.html',
  styles: ``
})
export class Proveedores implements OnInit {
  public readonly title = signal('PROVEEDORES');
  public readonly plusIcon = Plus;
  public readonly editIcon = Edit;
  public readonly deleteIcon = Trash2;
  public readonly phoneIcon = Phone;
  public readonly mailIcon = Mail;

  public proveedores = signal<IProveedor[]>([]);
  public mostrarModal = signal(false);
  public proveedorEditar = signal<IProveedor | null>(null);
  public filtro = signal('');

  private readonly proveedoresService = inject(ProveedoresService);

  ngOnInit() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedoresService.getProveedores().subscribe({
      next: (res) => {
        if (res.success) {
          this.proveedores.set(res.data);
        }
      },
      error: (error) => console.error('Error al cargar proveedores:', error)
    });
  }

  proveedoresFiltrados() {
    const filtro = this.filtro().toLowerCase();
    return this.proveedores().filter(p =>
      p.nombre.toLowerCase().includes(filtro) ||
      p.ruc.includes(filtro) ||
      p.email.toLowerCase().includes(filtro)
    );
  }

  abrirModal(proveedor?: IProveedor) {
    this.proveedorEditar.set(proveedor || null);
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.proveedorEditar.set(null);
  }

  onProveedorGuardado() {
    this.cargarProveedores();
  }

  eliminarProveedor(id: number) {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
      this.proveedoresService.eliminarProveedor(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.cargarProveedores();
          }
        }
      });
    }
  }

  contarActivos(): number {
    return this.proveedores().filter(p => p.estado === 'Activo').length;
  }

  contarInactivos(): number {
    return this.proveedores().filter(p => p.estado === 'Inactivo').length;
  }
}
