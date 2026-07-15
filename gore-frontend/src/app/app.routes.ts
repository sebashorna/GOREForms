import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'salud',
    loadChildren: () => import('./features/salud/salud-module').then(m => m.SaludModule)
  },
  {
    path: 'educacion',
    loadChildren: () => import('./features/educacion/educacion-module').then(m => m.EducacionModule)
  },
  {
    path: '',
    redirectTo: 'salud',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'salud'
  }
];