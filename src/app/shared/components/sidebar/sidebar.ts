import {Component, signal} from '@angular/core';
import {
  LucideAngularModule,
  LayoutDashboard,
  Logs,
  FileText,
  User,
  AlignEndHorizontal,
  LucideIconData
} from "lucide-angular";
import {RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";

export interface SidebarRoute {
  name: string;
  path: string;
  icon: LucideIconData;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, CommonModule],
  templateUrl: './sidebar.html',
  styles: ``
})
export class Sidebar {
  public readonly Inicio = LayoutDashboard
  public readonly Productos = Logs
  public readonly Ordenes = FileText
  public readonly Usuarios = User
  public readonly Reportes = AlignEndHorizontal

  protected routes =  signal<SidebarRoute[]>([
    {name: 'Inicio', path: '/dashboard', icon: this.Inicio, active: true},
    {name: 'Productos', path: '/products', icon: this.Productos},
    {name: 'Ordenes', path: '/ordenes', icon: this.Ordenes, active: true},
    {name: 'Usuarios', path: '/users', icon: this.Usuarios},
    {name: 'Reportes', path: '/reports', icon: this.Reportes},
  ])
}
