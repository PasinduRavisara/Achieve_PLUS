import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // We'll add dashboard route here later
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard').then(m => m.DashboardComponent)
      }
    ]
  }
];
