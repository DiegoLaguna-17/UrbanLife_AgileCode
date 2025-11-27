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
        path:'', pathMatch:'full', redirectTo:'administrar-proveedores'
      },
      {
        path:'crear-proyectos', loadComponent: ()=>import('./erp/roles/administrador/paginas/crear-proyectos/crear-proyectos').then(m=>m.CrearProyectos)
      },
      {
        path:'administrar-proveedores', loadComponent: ()=>import('./erp/roles/administrador/paginas/administrar-proveedores/administrar-proveedores').then(m=>m.AdministrarProveedores)
      },
      {
        path:'registrar-proveedores', loadComponent: ()=>import('./erp/roles/administrador/paginas/registrar-proveedores/registrar-proveedores').then(m=>m.RegistrarProveedores)
      },
      {
        path:'ver-proveedor', loadComponent: ()=>import('./erp/roles/administrador/paginas/ver-proveedor/ver-proveedor').then(m=>m.VerProveedor)
      },
      {
        path:'registrar-pedidos', loadComponent: ()=>import('./erp/roles/administrador/paginas/registrar-pedidos/registrar-pedidos').then(m=>m.RegistrarPedidos)
      },
      {
        path:'administrar-pedidos', loadComponent: ()=>import('./erp/roles/administrador/paginas/administrar-pedidos/administrar-pedidos').then(m=>m.AdministrarPedidos)
      },
      {
        path:'recibir-pedido', loadComponent: ()=>import('./erp/roles/administrador/paginas/recibir-pedido/recibir-pedido').then(m=>m.RecibirPedido)
      }
    ]
  },
  {
    path:'contador', loadComponent: ()=>import('./erp/roles/contador/contdor-shell/contdor-shell').then(m=>m.ContdorShell),
    children:[
      {
        path:'', pathMatch:'full', redirectTo:'administrar-solicitudes'
      },
      {
        path:'detalles', loadComponent: ()=>import('./erp/roles/contador/contdor-shell/contdor-shell').then(m=>m.ContdorShell)
      },
      {
        path:'administrar-solicitudes', loadComponent: ()=>import('./erp/roles/contador/paginas/administrar-solicitudes/administrar-solicitudes'). then(m=>m.AdministrarSolicitudes)
      },
      {
        path:'administrar-pagos-trabajadores', loadComponent: ()=>import('./erp/roles/contador/paginas/administrar-pagos-trabajadores/administrar-pagos-trabajadores').then(m=>m.AdministrarPagosTrabajadores)
      },
      {
        path:'administrar-presupuestos-proyectos', loadComponent: ()=>import('./erp/roles/contador/paginas/administrar-presupuestos-proyectos/administrar-presupuestos-proyectos').then(m=>m.AdministrarPresupuestosProyectos)
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
        path:'', pathMatch:'full', redirectTo:'registrar'
      },
      {
        path:'registrar', loadComponent: ()=>import('./erp/roles/rrhh/paginas/registrar/registrar').then(m=>m.Registrar)
      },
      {
        path:'administrar-empleados', loadComponent: ()=>import('./erp/roles/rrhh/paginas/administrar-empleados/administrar-empleados').then(m=>m.AdministrarEmpleadosComponent)
      },
      {
        path:'ver-empleado/:id', loadComponent: ()=>import('./erp/roles/rrhh/paginas/ver-empleado/ver-empleado').then(m=>m.VerEmpleado)
      },
      {
        path:'administrar-usuarios', loadComponent: ()=>import('./erp/roles/rrhh/paginas/administrar-usuarios/administrar-usuarios').then(m=>m.AdministrarUsuarios)
      },
      {
        path:'ver-usuario/:id', loadComponent: ()=>import('./erp/roles/rrhh/paginas/ver-usuario/ver-usuario').then(m=>m.VerUsuario)
      },
      {
        path:'administrar-trabajadores', loadComponent: ()=>import('./erp/roles/rrhh/paginas/administrar-trabajadores/administrar-trabajadores').then(m=>m.AdministrarTrabajadores)
      },
      {
        path:'ver-trabajador', loadComponent: ()=>import('./erp/roles/rrhh/paginas/ver-trabajador/ver-trabajador').then(m=>m.VerTrabajador)
      },
      {
        path:'registrar-trabajadores', loadComponent:()=>import('./erp/roles/rrhh/paginas/registrar-trabajadores/registrar-trabajadores').then(m=>m.RegistrarTrabajadores)
      }
    ]
  },

  //Redirección principal al cargar la app
  { path: '', redirectTo: 'inicio/home', pathMatch: 'full' },

  // 🚫 Captura solo rutas realmente inválidas
  { path: '**', redirectTo: 'inicio/home' }
];
