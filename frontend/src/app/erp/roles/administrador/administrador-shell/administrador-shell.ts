import { Component } from '@angular/core';
import { AdministradorSidebar } from '../componentes/administrador-sidebar/administrador-sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-administrador-shell',
  imports: [AdministradorSidebar,RouterOutlet],
  templateUrl: './administrador-shell.html',
  styleUrl: './administrador-shell.scss'
})
export class AdministradorShell {
   onLogout(){
    // Cuando tengas auth real, llama a tu servicio y navega a /login
    location.href = '';
  }
}
