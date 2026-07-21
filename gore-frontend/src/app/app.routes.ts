import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { Salud } from './pages/salud/salud';
import { Educacion } from './pages/educacion/educacion';
import { Historial } from './pages/historial/historial';
import { AuthGuard } from './guards/auth.guard';

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
    canActivate: [AuthGuard],
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
      {
         path: 'historial',
         component: Historial
      },

    ]
  },

  // Cualquier ruta inexistente
  {
    path: '**',
    redirectTo: 'login'
  }

];