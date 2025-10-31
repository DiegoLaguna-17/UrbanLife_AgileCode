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
  {
    path:'administrador', loadComponent: ()=>import('./erp/roles/administrador/administrador-shell/administrador-shell').then(m=>m.AdministradorShell),
    children:[
      {
        path:'', pathMatch:'full', redirectTo:'crear-proyectos'
      },
      {
        path:'crear-proyectos', loadComponent: ()=>import('./erp/roles/administrador/paginas/crear-proyectos/crear-proyectos').then(m=>m.CrearProyectos)
      }
    ]
  },
  {
    path:'contador', loadComponent: ()=>import('./erp/roles/contador/contdor-shell/contdor-shell').then(m=>m.ContdorShell),
    children:[
      {
        path:'', pathMatch:'full', redirectTo:'detalles'
      },
      {
        path:'detalles', loadComponent: ()=>import('./erp/roles/contador/contdor-shell/contdor-shell').then(m=>m.ContdorShell)
      }
    ]
  },
  {
    path:'jefeobra', loadComponent: ()=>import('./erp/roles/jefeobra/jefeobra-shell/jefeobra-shell'). then(m=>m.JefeobraShell),
    children:[
      {
        path:'', pathMatch:'full', redirectTo:'ver-proyectos'
      },
      {
        path:'ver-proyectos', loadComponent: ()=>import('./erp/roles/jefeobra/jefeobra-shell/jefeobra-shell').then(m=>m.JefeobraShell)
      }
    ]
  },
  {
    path:'rrhh', loadComponent:()=>import('./erp/roles/rrhh/rrhh-shell/rrhh-shell'). then(m=>m.RrhhShell),
    children:[
      {
        path:'registrar', loadComponent: ()=>import('./erp/roles/rrhh/rrhh-shell/rrhh-shell').then(m=>m.RrhhShell)
      }
    ]
  },

  //Redirección principal al cargar la app
  { path: '', redirectTo: 'inicio/home', pathMatch: 'full' },

  // 🚫 Captura solo rutas realmente inválidas
  { path: '**', redirectTo: 'inicio/home' }
];
