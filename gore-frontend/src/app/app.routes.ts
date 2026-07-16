import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './shared/layout/main-layout/main-layout';

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },

  {
    path: '',
    component: MainLayout,
    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];