import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContadorSidebar } from '../componentes/contador-sidebar/contador-sidebar';

@Component({
  selector: 'app-contdor-shell',
  imports: [ContadorSidebar,RouterOutlet],
  templateUrl: './contdor-shell.html',
  styleUrl: './contdor-shell.scss'
})
export class ContdorShell {
  onLogout(){
    // Cuando tengas auth real, llama a tu servicio y navega a /login
    location.href = '';
  }
}
