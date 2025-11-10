import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  correo: string;
  contrasena: string;
  activo: boolean;
  empleadoId?: number;
}
@Component({
  selector: 'app-card-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-usuario.html',
  styleUrl: './card-usuario.scss'
})
export class CardUsuario {
  @Input() usuario!: Usuario;

  constructor(private router: Router) {}

  onVerClick(): void {
    console.log('Navegando a usuario:', this.usuario.id);
    this.router.navigate(['/rrhh/ver-usuario', this.usuario.id], {
      state: { usuario: this.usuario }
    });
  }
}
