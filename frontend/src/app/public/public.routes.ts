import { Routes } from '@angular/router';
import { PublicShell} from './shell/public-shell/public-shell';
import { Home } from './pages/home/home';
import { Nosotros } from './pages/nosotros/nosotros';
import { Servicios } from './pages/servicios/servicios';
import { Contacto } from './pages/contacto/contacto';
export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicShell,
    children: [
      { path: '', component: Home, title: 'UrbanLife - Inicio' },
      { path: 'nosotros', component: Nosotros, title: 'UrbanLife - Nosotros' },
      { path: 'servicios', component: Servicios, title: 'UrbanLife - Servicios' },
      { path: 'contacto', component: Contacto, title: 'UrbanLife - Contacto'}
    ]
  }
];
