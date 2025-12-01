import {Routes} from '@angular/router';
import {Layout} from "./modules/layout/layout";

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        title: 'Inicio',
        loadComponent: () => import('./modules/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'productos',
        title: 'Productos',
        loadComponent: () => import('./modules/productos/productos').then(m => m.Productos)
      },
      {
        path: 'ordenes',
        title: 'Ordenes',
        loadComponent: () => import('./modules/ordenes/ordenes').then(m => m.Ordenes)
      },
      {
        path: 'usuarios',
        title: 'Usuarios',
        loadComponent: () => import('./modules/usuarios/usuarios').then(m => m.Usuarios)
      },
      {
        path: 'proveedores',
        title: 'Proveedores',
        loadComponent: () => import('./modules/proveedores/proveedores').then(m => m.Proveedores)
      },
      {
        path: 'almacen',
        title: 'Almacén',
        loadComponent: () => import('./modules/almacen/almacen').then(m => m.Almacen)
      },
      {
        path: 'reportes',
        title: 'Reportes',
        loadComponent: () => import('./modules/reportes/reportes').then(m => m.Reportes)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
];
