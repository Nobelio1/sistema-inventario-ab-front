import { Component, EventEmitter, Input, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../../../api/productos.service';
import { IProducto } from '../../../../shared/interfaces/producto.interface';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-nuevo-producto-modal',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './nuevo-producto-modal.html',
  styles: ``
})
export class NuevoProductoModal implements OnInit {
  @Input() producto: IProducto | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() productoGuardado = new EventEmitter<void>();

  public readonly closeIcon = X;
  public productoForm!: FormGroup;
  public isSubmitting = signal(false);
  public categorias = ['Granos', 'Aceites', 'Endulzantes', 'Pastas', 'Lácteos', 'Bebidas', 'Enlatados', 'Limpieza', 'Otros'];

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.productoForm = this.fb.group({
      codigo: [this.producto?.codigo || '', [Validators.required, Validators.minLength(3)]],
      nombre: [this.producto?.nombre || '', [Validators.required, Validators.minLength(3)]],
      categoria: [this.producto?.categoria || '', [Validators.required]],
      precio: [this.producto?.precio || 0, [Validators.required, Validators.min(0.01)]],
      stock: [this.producto?.stock || 0, [Validators.required, Validators.min(0)]],
      stockMinimo: [this.producto?.stockMinimo || 0, [Validators.required, Validators.min(1)]],
      ubicacion: [this.producto?.ubicacion || '', [Validators.required]],
      estado: [this.producto?.estado || 'Activo', [Validators.required]],
      fechaVencimiento: [this.producto?.fechaVencimiento || ''],
      proveedor: [this.producto?.proveedor || '']
    });
  }

  onSubmit() {
    if (this.productoForm.invalid) {
      Object.keys(this.productoForm.controls).forEach(key => {
        this.productoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);
    const productoData: IProducto = this.productoForm.value;

    const observable = this.producto
      ? this.productosService.actualizarProducto({ ...productoData, id: this.producto.id })
      : this.productosService.crearProducto(productoData);

    observable.subscribe({
      next: (res) => {
        if (res.success) {
          this.productoGuardado.emit();
          this.close();
        }
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Error al guardar el producto');
        this.isSubmitting.set(false);
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
