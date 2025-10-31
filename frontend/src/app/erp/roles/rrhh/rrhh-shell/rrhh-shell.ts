import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RrhhSidebar } from '../componentes/rrhh-sidebar/rrhh-sidebar';

@Component({
  selector: 'app-rrhh-shell',
  imports: [RrhhSidebar, RouterOutlet],
  templateUrl: './rrhh-shell.html',
  styleUrl: './rrhh-shell.scss'
})
export class RrhhShell {
  onLogout(){
    // Cuando tengas auth real, llama a tu servicio y navega a /login
    location.href = '';
  }
}
