// src/app/modules/almacen/almacen.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../api/productos.service';
import { AjustesService } from '../../api/ajustes.service';
import { IProducto } from '../../shared/interfaces/producto.interface';
import { IAjuste } from '../../shared/interfaces/ajuste.interface';
import { LucideAngularModule, AlertTriangle, Edit2, Package, History } from 'lucide-angular';
import { AjusteInventarioModal } from './components/ajuste-inventario-modal/ajuste-inventario-modal';

@Component({
  selector: 'app-almacen',
  imports: [CommonModule, FormsModule, LucideAngularModule, AjusteInventarioModal],
  templateUrl: './almacen.html',
  styles: ``
})
export class Almacen implements OnInit {
  public readonly title = signal('GESTIÓN DE ALMACÉN');
  public readonly warningIcon = AlertTriangle;
  public readonly editIcon = Edit2;
  public readonly packageIcon = Package;
  public readonly historyIcon = History;

  public productos = signal<IProducto[]>([]);
  public ajustes = signal<IAjuste[]>([]);
  public productosStockBajo = signal<IProducto[]>([]);
  public mostrarModalAjuste = signal(false);
  public productoAjustar = signal<IProducto | null>(null);
  public vistaActual = signal<'productos' | 'stockBajo' | 'historial'>('productos');

  private readonly productosService = inject(ProductosService);
  private readonly ajustesService = inject(AjustesService);

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.productosService.getProductos().subscribe({
      next: (res) => {
        if (res.success) {
          this.productos.set(res.data);
        }
      }
    });

    this.productosService.getProductosStockBajo().subscribe({
      next: (res) => {
        if (res.success) {
          this.productosStockBajo.set(res.data);
        }
      }
    });

    this.ajustesService.getAjustes().subscribe({
      next: (res) => {
        if (res.success) {
          this.ajustes.set(res.data);
        }
      }
    });
  }

  cambiarVista(vista: 'productos' | 'stockBajo' | 'historial') {
    this.vistaActual.set(vista);
  }

  abrirModalAjuste(producto: IProducto) {
    this.productoAjustar.set(producto);
    this.mostrarModalAjuste.set(true);
  }

  cerrarModalAjuste() {
    this.mostrarModalAjuste.set(false);
    this.productoAjustar.set(null);
  }

  onAjusteRealizado() {
    this.cargarDatos();
  }

  getEstadoStock(producto: IProducto): string {
    if (producto.stock <= producto.stockMinimo) return 'Crítico';
    if (producto.stock <= producto.stockMinimo * 1.5) return 'Bajo';
    return 'Normal';
  }

  getColorEstado(producto: IProducto): string {
    const estado = this.getEstadoStock(producto);
    if (estado === 'Crítico') return 'text-red-600 bg-red-50';
    if (estado === 'Bajo') return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  }

  formatearFecha(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
