import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JefeobraSidebar } from '../componentes/jefeobra-sidebar/jefeobra-sidebar';

@Component({
  selector: 'app-jefeobra-shell',
  imports: [JefeobraSidebar, RouterOutlet],
  templateUrl: './jefeobra-shell.html',
  styleUrl: './jefeobra-shell.scss'
})
export class JefeobraShell {
  onLogout(){
    // Cuando tengas auth real, llama a tu servicio y navega a /login
    location.href = '';
  }
}
