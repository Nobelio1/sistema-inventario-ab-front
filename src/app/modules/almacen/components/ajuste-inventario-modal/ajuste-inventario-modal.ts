import { Component, EventEmitter, Input, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AjustesService } from '../../../../api/ajustes.service';
import { IProducto } from '../../../../shared/interfaces/producto.interface';
import { IAjuste } from '../../../../shared/interfaces/ajuste.interface';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-ajuste-inventario-modal',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './ajuste-inventario-modal.html',
  styles: ``
})
export class AjusteInventarioModal implements OnInit {
  @Input() producto!: IProducto;
  @Output() closeModal = new EventEmitter<void>();
  @Output() ajusteRealizado = new EventEmitter<void>();

  public readonly closeIcon = X;
  public ajusteForm!: FormGroup;
  public isSubmitting = signal(false);
  public motivos = ['Error de registro', 'Merma', 'Daño', 'Pérdida', 'Robo', 'Corrección física', 'Otro'];

  constructor(
    private fb: FormBuilder,
    private ajustesService: AjustesService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.ajusteForm = this.fb.group({
      cantidadNueva: [this.producto.stock, [Validators.required, Validators.min(0)]],
      motivo: ['', [Validators.required]],
      justificacion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  calcularDiferencia(): number {
    const cantidadNueva = this.ajusteForm.get('cantidadNueva')?.value || 0;
    return cantidadNueva - this.producto.stock;
  }

  onSubmit() {
    if (this.ajusteForm.invalid) return;

    this.isSubmitting.set(true);

    const ajuste: Omit<IAjuste, 'id'> = {
      fecha: new Date().toISOString(),
      productoId: this.producto.id!,
      productoNombre: this.producto.nombre,
      cantidadAnterior: this.producto.stock,
      cantidadNueva: this.ajusteForm.value.cantidadNueva,
      diferencia: this.calcularDiferencia(),
      motivo: this.ajusteForm.value.motivo,
      justificacion: this.ajusteForm.value.justificacion,
      usuarioId: 1, // Usuario actual del sistema
      usuarioNombre: 'Juan Pérez' // Obtener del sistema de autenticación
    };

    this.ajustesService.registrarAjuste(ajuste).subscribe({
      next: (res) => {
        if (res.success) {
          this.ajusteRealizado.emit();
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
