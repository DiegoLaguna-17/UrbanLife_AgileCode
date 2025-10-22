import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public/public.routes').then(m => m.PUBLIC_ROUTES),
  },
  {
    path: 'erp',
    loadChildren: () => import('./erp/erp.routes').then(m => m.ERP_ROUTES),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./erp/login/login').then(m => m.Login),
    title: 'UrbanLife - Login',
  },
  { path: '**', redirectTo: '' }
];
