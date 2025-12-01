import { Component, EventEmitter, Input, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedoresService } from '../../../../api/proveedores.service';
import { IProveedor } from '../../../../shared/interfaces/proveedor.interface';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-nuevo-proveedor-modal',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './nuevo-proveedor-modal.html',
  styles: ``
})
export class NuevoProveedorModal implements OnInit {
  @Input() proveedor: IProveedor | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() proveedorGuardado = new EventEmitter<void>();

  public readonly closeIcon = X;
  public proveedorForm!: FormGroup;
  public isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.proveedorForm = this.fb.group({
      nombre: [this.proveedor?.nombre || '', [Validators.required]],
      ruc: [this.proveedor?.ruc || '', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      telefono: [this.proveedor?.telefono || '', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: [this.proveedor?.email || '', [Validators.required, Validators.email]],
      direccion: [this.proveedor?.direccion || '', [Validators.required]],
      estado: [this.proveedor?.estado || 'Activo', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.proveedorForm.invalid) return;

    this.isSubmitting.set(true);
    const proveedorData: IProveedor = this.proveedorForm.value;

    const observable = this.proveedor
      ? this.proveedoresService.actualizarProveedor({ ...proveedorData, id: this.proveedor.id })
      : this.proveedoresService.crearProveedor(proveedorData);

    observable.subscribe({
      next: (res) => {
        if (res.success) {
          this.proveedorGuardado.emit();
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
