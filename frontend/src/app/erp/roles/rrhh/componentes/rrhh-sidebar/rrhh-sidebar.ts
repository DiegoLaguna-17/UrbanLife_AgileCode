import { CommonModule } from '@angular/common';
import { Component, EventEmitter,Output,signal } from '@angular/core';
import { RouterLink,RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-rrhh-sidebar',
  imports: [CommonModule,RouterLink,RouterLinkActive,RouterModule],
  templateUrl: './rrhh-sidebar.html',
  styleUrl: './rrhh-sidebar.scss'
})
export class RrhhSidebar {
  @Output() logout = new EventEmitter<void>();
  openAlertas = signal(false);
  toggleAlertas(){ this.openAlertas.update(v => !v); }
  perfil(){
    console.log('yendo a perfil')
  }
  sidebarOpen: boolean = false;
}
