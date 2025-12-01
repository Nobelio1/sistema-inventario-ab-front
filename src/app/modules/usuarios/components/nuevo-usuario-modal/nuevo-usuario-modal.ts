import { Component, EventEmitter, Input, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../../../api/usuarios.service';
import { IUsuario } from '../../../../shared/interfaces/usuario.interface';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-nuevo-usuario-modal',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './nuevo-usuario-modal.html',
  styles: ``
})
export class NuevoUsuarioModal implements OnInit {
  @Input() usuario: IUsuario | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() usuarioGuardado = new EventEmitter<void>();

  public readonly closeIcon = X;
  public usuarioForm!: FormGroup;
  public isSubmitting = signal(false);
  public roles = ['Administrador', 'Almacenero', 'Cajero', 'Vendedor'];

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.usuarioForm = this.fb.group({
      nombre: [this.usuario?.nombre || '', [Validators.required]],
      usuario: [this.usuario?.usuario || '', [Validators.required, Validators.minLength(4)]],
      email: [this.usuario?.email || '', [Validators.required, Validators.email]],
      rol: [this.usuario?.rol || '', [Validators.required]],
      estado: [this.usuario?.estado || 'Activo', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.usuarioForm.invalid) return;

    this.isSubmitting.set(true);
    const usuarioData: IUsuario = this.usuarioForm.value;

    const observable = this.usuario
      ? this.usuariosService.actualizarUsuario({ ...usuarioData, id: this.usuario.id })
      : this.usuariosService.crearUsuario(usuarioData);

    observable.subscribe({
      next: (res) => {
        if (res.success) {
          this.usuarioGuardado.emit();
          this.close();
        }
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error:', error);
        this.isSubmitting.set(false);
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
