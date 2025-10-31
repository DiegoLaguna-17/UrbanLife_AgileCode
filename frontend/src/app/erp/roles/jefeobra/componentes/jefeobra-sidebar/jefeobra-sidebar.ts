import { CommonModule } from '@angular/common';
import { Component, EventEmitter,Output,signal } from '@angular/core';
import { RouterLink,RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-jefeobra-sidebar',
  imports: [CommonModule,RouterLink,RouterLinkActive,RouterModule],
  templateUrl: './jefeobra-sidebar.html',
  styleUrl: './jefeobra-sidebar.scss'
})
export class JefeobraSidebar {
  @Output() logout = new EventEmitter<void>();
  openAlertas = signal(false);
  toggleAlertas(){ this.openAlertas.update(v => !v); }
  perfil(){
    console.log('yendo a perfil')
  }
}
