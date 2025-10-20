import {Component, EventEmitter, Output, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import {ProveedoresService} from '../../../../api/proveedores.service';
import {ProductosService} from '../../../../api/productos.service';
import {OrdenesService} from '../../../../api/ordenes.service';
import {IProducto, IDetalleOrden, ICrearOrden, IProveedorSelect} from '../../interfaces/orden.interface';
import {LucideAngularModule, X} from "lucide-angular";

@Component({
  selector: 'app-nueva-orden-modal',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule],
  templateUrl: './nueva-orden-modal.html',
  styles: ``
})
export class NuevaOrdenModal implements OnInit {

  public readonly closeIcon = X

  @Output() closeModal = new EventEmitter<void>();
  @Output() ordenCreada = new EventEmitter<void>();

  ordenForm!: FormGroup;
  proveedores = signal<IProveedorSelect[]>([]);
  productos = signal<IProducto[]>([]);
  productosSeleccionados = signal<(IDetalleOrden & { nombreProducto: string; precioUnitario: number })[]>([]);
  productoSeleccionado: number | null = null;
  cantidadProducto: number = 1;
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService,
    private productosService: ProductosService,
    private ordenesService: OrdenesService
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.cargarProveedores();
    this.cargarProductos();
  }

  initForm() {
    this.ordenForm = this.fb.group({
      idProveedor: ['', [Validators.required]],
      fechaOrden: [this.getFechaActual(), [Validators.required]]
    });
  }

  getFechaActual(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cargarProveedores() {
    this.proveedoresService.getProveedores().subscribe({
      next: (res) => {
        const {data, success, message} = res;
        if (!success) {
          console.error(message)
          return
        }

        this.proveedores.set(data);
      },
      error: (error) => {
        console.error('Error al cargar proveedores:', error);
      }
    });
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe({
      next: (res) => {
        const {data, success, message} = res;
        if (!success) {
          console.error(message)
          return
        }

        this.productos.set(data);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

  agregarProducto() {
    if (!this.productoSeleccionado || this.cantidadProducto <= 0) {
      return;
    }
    const producto = this.productos().find(p => p.id === Number(this.productoSeleccionado));

    if (!producto) return;

    const existente = this.productosSeleccionados().find(p => p.idProducto === producto.id);

    if (existente) {
      const actualizados = this.productosSeleccionados().map(p =>
        p.idProducto === producto.id
          ? {...p, cantidad: p.cantidad + this.cantidadProducto}
          : p
      );
      this.productosSeleccionados.set(actualizados);
    } else {
      this.productosSeleccionados.set([
        ...this.productosSeleccionados(),
        {
          idProducto: producto.id,
          cantidad: this.cantidadProducto,
          nombreProducto: producto.nombre,
          precioUnitario: producto.precio
        }
      ]);
    }
    this.productoSeleccionado = null;
    this.cantidadProducto = 1;
  }

  eliminarProducto(idProducto: number) {
    this.productosSeleccionados.set(
      this.productosSeleccionados().filter(p => p.idProducto !== idProducto)
    );
  }

  calcularSubtotal(item: any): number {
    return item.cantidad * item.precioUnitario;
  }

  calcularTotal(): number {
    return this.productosSeleccionados().reduce((total, item) =>
      total + this.calcularSubtotal(item), 0
    );
  }

  onSubmit() {
    if (this.ordenForm.invalid || this.productosSeleccionados().length === 0) {
      alert('Por favor complete todos los campos y agregue al menos un producto');
      return;
    }

    this.isSubmitting.set(true);

    const detalleOrden: IDetalleOrden[] = this.productosSeleccionados().map(p => ({
      idProducto: p.idProducto,
      cantidad: p.cantidad
    }));

    const fecha = new Date(this.ordenForm.get('fechaOrden')?.value);
    const fechaOrden = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}T${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}:${String(fecha.getSeconds()).padStart(2, '0')}`;

    const nuevaOrden: ICrearOrden = {
      ...this.ordenForm.value,
      idProveedor: Number(this.ordenForm.value.idProveedor),
      detalleOrden,
      idUsuario: 4,
      fechaOrden,
    };

    console.log('Orden a crear:', nuevaOrden);

    this.ordenesService.crearOrdenCompra(nuevaOrden).subscribe({
      next: (response) => {
        console.log('Orden creada exitosamente:', response);
        this.isSubmitting.set(false);
        this.ordenCreada.emit();
        this.close();
      },
      error: (error) => {
        console.error('Error al crear orden:', error);
        this.isSubmitting.set(false);
        alert('Error al crear la orden. Por favor intente nuevamente.');
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
