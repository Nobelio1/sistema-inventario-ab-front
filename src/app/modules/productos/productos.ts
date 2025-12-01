import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../api/productos.service';
import { IProducto } from '../../shared/interfaces/producto.interface';
import { LucideAngularModule, Plus, Edit, Trash2, AlertTriangle } from 'lucide-angular';
import { NuevoProductoModal } from './components/nuevo-producto-modal/nuevo-producto-modal';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule, LucideAngularModule, NuevoProductoModal],
  templateUrl: './productos.html',
  styles: ``
})
export class Productos implements OnInit {
  public readonly title = signal('PRODUCTOS');
  public readonly plusIcon = Plus;
  public readonly editIcon = Edit;
  public readonly deleteIcon = Trash2;
  public readonly warningIcon = AlertTriangle;

  public productos = signal<IProducto[]>([]);
  public mostrarModal = signal(false);
  public productoEditar = signal<IProducto | null>(null);
  public filtro = signal('');

  private readonly productosService = inject(ProductosService);

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe({
      next: (res) => {
        if (res.success) {
          this.productos.set(res.data);
        }
      },
      error: (error) => console.error('Error al cargar productos:', error)
    });
  }

  productosFiltrados() {
    const filtro = this.filtro().toLowerCase();
    return this.productos().filter(p =>
      p.nombre.toLowerCase().includes(filtro) ||
      p.codigo.toLowerCase().includes(filtro) ||
      p.categoria.toLowerCase().includes(filtro)
    );
  }

  abrirModal(producto?: IProducto) {
    this.productoEditar.set(producto || null);
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.productoEditar.set(null);
  }

  onProductoGuardado() {
    this.cargarProductos();
  }

  eliminarProducto(id: number) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productosService.eliminarProducto(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.cargarProductos();
          }
        }
      });
    }
  }

  esStockBajo(producto: IProducto): boolean {
    return producto.stock <= producto.stockMinimo;
  }

  contarStockBajo(): number {
    return this.productos().filter(p => this.esStockBajo(p)).length;
  }

  contarStockNormal(): number {
    return this.productos().filter(p => !this.esStockBajo(p)).length;
  }
}
