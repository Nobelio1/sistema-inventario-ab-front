import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductosService} from '../../api/productos.service';
import {MovimientosService} from '../../api/movimientos.service';
import {SalidasService} from '../../api/salidas.service';
import {OrdenesService} from '../../api/ordenes.service';
import {IProducto} from '../../shared/interfaces/producto.interface';
import {IMovimiento} from '../../shared/interfaces/movimiento.interface';
import {ISalida} from '../../shared/interfaces/salida.interface';
import {IOrdenes} from '../ordenes/interfaces/orden.interface';
import {
  LucideAngularModule,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  FileText
} from 'lucide-angular';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  public readonly title = signal('PANEL DE CONTROL');
  public readonly packageIcon = Package;
  public readonly warningIcon = AlertTriangle;
  public readonly upIcon = TrendingUp;
  public readonly downIcon = TrendingDown;
  public readonly cartIcon = ShoppingCart;
  public readonly fileIcon = FileText;

  public productos = signal<IProducto[]>([]);
  public productosStockBajo = signal<IProducto[]>([]);
  public movimientos = signal<IMovimiento[]>([]);
  public salidas = signal<ISalida[]>([]);
  public ordenes = signal<IOrdenes[]>([]);

  private readonly productosService = inject(ProductosService);
  private readonly movimientosService = inject(MovimientosService);
  private readonly salidasService = inject(SalidasService);
  private readonly ordenesService = inject(OrdenesService);

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

    this.movimientosService.getMovimientos().subscribe({
      next: (res) => {
        if (res.success) {
          this.movimientos.set(res.data.slice(0, 5));
        }
      }
    });

    this.salidasService.getSalidas().subscribe({
      next: (res) => {
        if (res.success) {
          this.salidas.set(res.data);
        }
      }
    });

    this.ordenesService.getOrdenes().subscribe({
      next: (res) => {
        if (res.success) {
          this.ordenes.set(res.data);
        }
      }
    });
  }

  calcularValorInventario(): number {
    return this.productos().reduce((sum, p) => sum + (p.stock * p.precio), 0);
  }

  calcularVentasHoy(): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return this.salidas()
      .filter(s => new Date(s.fecha) >= hoy)
      .reduce((sum, s) => sum + s.total, 0);
  }

  contarOrdenesPendientes(): number {
    return this.ordenes().filter(o => o.estado === 'Pendiente').length;
  }

  // Método para contar productos por categoría
  contarProductosPorCategoria(categoria: string): number {
    return this.productos().filter(p => p.categoria === categoria).length;
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
