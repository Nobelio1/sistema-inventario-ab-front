// src/app/modules/usuarios/usuarios.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../api/usuarios.service';
import { IUsuario } from '../../shared/interfaces/usuario.interface';
import { LucideAngularModule, Plus, Edit, Trash2, UserCircle } from 'lucide-angular';
import { NuevoUsuarioModal } from './components/nuevo-usuario-modal/nuevo-usuario-modal';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule, LucideAngularModule, NuevoUsuarioModal],
  templateUrl: './usuarios.html',
  styles: ``
})
export class Usuarios implements OnInit {
  public readonly title = signal('USUARIOS');
  public readonly plusIcon = Plus;
  public readonly editIcon = Edit;
  public readonly deleteIcon = Trash2;
  public readonly userIcon = UserCircle;

  public usuarios = signal<IUsuario[]>([]);
  public mostrarModal = signal(false);
  public usuarioEditar = signal<IUsuario | null>(null);
  public filtro = signal('');

  private readonly usuariosService = inject(UsuariosService);

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (res) => {
        if (res.success) {
          this.usuarios.set(res.data);
        }
      },
      error: (error) => console.error('Error al cargar usuarios:', error)
    });
  }

  usuariosFiltrados() {
    const filtro = this.filtro().toLowerCase();
    return this.usuarios().filter(u =>
      u.nombre.toLowerCase().includes(filtro) ||
      u.email.toLowerCase().includes(filtro) ||
      u.rol.toLowerCase().includes(filtro)
    );
  }

  abrirModal(usuario?: IUsuario) {
    this.usuarioEditar.set(usuario || null);
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.usuarioEditar.set(null);
  }

  onUsuarioGuardado() {
    this.cargarUsuarios();
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.usuariosService.eliminarUsuario(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.cargarUsuarios();
          }
        }
      });
    }
  }

  getColorRol(rol: string): string {
    const colores: { [key: string]: string } = {
      'Administrador': 'bg-purple-100 text-purple-800',
      'Almacenero': 'bg-blue-100 text-blue-800',
      'Cajero': 'bg-green-100 text-green-800',
      'Vendedor': 'bg-yellow-100 text-yellow-800'
    };
    return colores[rol] || 'bg-gray-100 text-gray-800';
  }

  // Método para contar usuarios activos
  contarUsuariosActivos(): number {
    return this.usuarios().filter(u => u.estado === 'Activo').length;
  }
}
