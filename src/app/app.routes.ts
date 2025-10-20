import {Routes} from '@angular/router';
import {Layout} from "./modules/layout/layout";

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'ordenes',
        title: 'Ordenes',
        loadComponent: () => import('./modules/ordenes/ordenes').then(m => m.Ordenes)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
];
