import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { Salud } from './pages/salud/salud';
import { Educacion } from './pages/educacion/educacion';

export const routes: Routes = [

  // Página inicial
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Login
  {
    path: 'login',
    component: Login
  },

  // Layout principal
  {
    path: '',
    component: MainLayout,
    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },
      {
         path: 'salud',
         component: Salud
      },
      {
         path: 'educacion',
         component: Educacion
      },

    ]
  },

  // Cualquier ruta inexistente
  {
    path: '**',
    redirectTo: 'login'
  }

];