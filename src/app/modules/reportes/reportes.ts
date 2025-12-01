// src/app/modules/reportes/reportes.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientosService } from '../../api/movimientos.service';
import { SalidasService } from '../../api/salidas.service';
import { ProductosService } from '../../api/productos.service';
import { IMovimiento } from '../../shared/interfaces/movimiento.interface';
import { ISalida } from '../../shared/interfaces/salida.interface';
import { IProducto } from '../../shared/interfaces/producto.interface';
import { LucideAngularModule, FileText, Download, Printer, TrendingUp, TrendingDown } from 'lucide-angular';

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './reportes.html',
  styles: ``
})
export class Reportes implements OnInit {
  public readonly title = signal('REPORTES');
  public readonly fileIcon = FileText;
  public readonly downloadIcon = Download;
  public readonly printerIcon = Printer;
  public readonly upIcon = TrendingUp;
  public readonly downIcon = TrendingDown;

  public movimientos = signal<IMovimiento[]>([]);
  public salidas = signal<ISalida[]>([]);
  public productos = signal<IProducto[]>([]);

  public fechaInicio = signal('');
  public fechaFin = signal('');
  public tipoMovimiento = signal('Todos');
  public tipoReporte = signal<'movimientos' | 'salidas' | 'productos'>('movimientos');

  private readonly movimientosService = inject(MovimientosService);
  private readonly salidasService = inject(SalidasService);
  private readonly productosService = inject(ProductosService);

  ngOnInit() {
    this.setFechasDefault();
    this.cargarDatos();
  }

  setFechasDefault() {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    this.fechaInicio.set(this.formatDate(hace30Dias));
    this.fechaFin.set(this.formatDate(hoy));
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cargarDatos() {
    if (this.tipoReporte() === 'movimientos') {
      this.movimientosService.getMovimientosPorFecha(
        this.fechaInicio(),
        this.fechaFin()
      ).subscribe({
        next: (res) => {
          if (res.success) {
            this.movimientos.set(res.data);
          }
        }
      });
    } else if (this.tipoReporte() === 'salidas') {
      this.salidasService.getSalidas().subscribe({
        next: (res) => {
          if (res.success) {
            const filtradas = res.data.filter(s => {
              const fecha = new Date(s.fecha);
              return fecha >= new Date(this.fechaInicio()) &&
                fecha <= new Date(this.fechaFin());
            });
            this.salidas.set(filtradas);
          }
        }
      });
    }

    this.productosService.getProductos().subscribe({
      next: (res) => {
        if (res.success) {
          this.productos.set(res.data);
        }
      }
    });
  }

  movimientosFiltrados() {
    if (this.tipoMovimiento() === 'Todos') {
      return this.movimientos();
    }
    return this.movimientos().filter(m => m.tipo === this.tipoMovimiento());
  }

  calcularTotalSalidas(): number {
    return this.salidas().reduce((sum, s) => sum + s.total, 0);
  }

  calcularTotalMovimientos(tipo: 'Entrada' | 'Salida'): number {
    return this.movimientos()
      .filter(m => m.tipo === tipo)
      .reduce((sum, m) => sum + m.cantidad, 0);
  }

  // Método para calcular el valor total del inventario
  calcularValorTotalInventario(): number {
    return this.productos().reduce((sum, p) => sum + (p.stock * p.precio), 0);
  }

  getProductosMasVendidos() {
    const ventas: { [key: string]: number } = {};

    this.salidas().forEach(salida => {
      salida.productos.forEach(prod => {
        if (ventas[prod.productoNombre]) {
          ventas[prod.productoNombre] += prod.cantidad;
        } else {
          ventas[prod.productoNombre] = prod.cantidad;
        }
      });
    });

    return Object.entries(ventas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }));
  }

  exportarPDF() {
    alert('Funcionalidad de exportar PDF - Implementar con jsPDF');
  }

  exportarExcel() {
    alert('Funcionalidad de exportar Excel - Implementar con SheetJS');
  }

  imprimir() {
    window.print();
  }

  formatearFecha(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
