import { Routes } from '@angular/router';
import { PublicShell } from './public/shell/public-shell/public-shell';
import { Home } from './public/pages/home/home';
import { Nosotros } from './public/pages/nosotros/nosotros';
import { Servicios } from './public/pages/servicios/servicios';
import { Contacto } from './public/pages/contacto/contacto';
export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./erp/loginc/login/login').then(m => m.Login)
      },
      {
        path: 'verificacion',
        loadComponent: () =>
          import('./erp/loginc/dos-pasos/dos-pasos').then(m => m.DosPasos)
      },
      {
        path: 'recuperar',
        loadComponent: () =>
          import('./erp/loginc/recuperar/recuperar').then(
            m => m.RecuperarComponent
          )
      },
      {
        path:'cambiar-contrasenia',
        loadComponent:()=>import('./erp/loginc/cambiar-contra/cambiar-contra').then(m=>m.CambiarContra)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  { 
    path: 'inicio',
    component: PublicShell,
    children: [
      { path: 'home', component: Home, title: 'UrbanLife - Inicio', pathMatch: 'full' },
      { path: 'nosotros', component: Nosotros, title: 'UrbanLife - Nosotros' },
      { path: 'servicios', component: Servicios, title: 'UrbanLife - Servicios' },
      { path: 'contacto', component: Contacto, title: 'UrbanLife - Contacto' }
    ]
  },

  //Redirección principal al cargar la app
  { path: '', redirectTo: 'inicio/home', pathMatch: 'full' },

  // 🚫 Captura solo rutas realmente inválidas
  { path: '**', redirectTo: 'inicio/home' }
];
