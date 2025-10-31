import { CommonModule } from '@angular/common';
import { Component, EventEmitter,Output,signal } from '@angular/core';
import { RouterLink,RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-contador-sidebar',
  imports: [CommonModule,RouterLink,RouterLinkActive,RouterModule],
  templateUrl: './contador-sidebar.html',
  styleUrl: './contador-sidebar.scss'
})
export class ContadorSidebar {
  @Output() logout = new EventEmitter<void>();
  openAlertas = signal(false);
  toggleAlertas(){ this.openAlertas.update(v => !v); }
  perfil(){
    console.log('yendo a perfil')
  }
}
