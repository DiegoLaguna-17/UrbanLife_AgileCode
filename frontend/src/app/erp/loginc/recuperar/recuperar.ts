import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.scss'
})
export class RecuperarComponent {
  email = '';
  enviado = false;
emailError: string = '';
  constructor(private router: Router) {}

  onEnviar() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!this.email) {
    this.emailError = 'El correo es obligatorio.';
    return;
  }

  if (!emailPattern.test(this.email)) {
    this.emailError = 'Debe ingresar un correo válido (ej. usuario@dominio.com).';
    return;
  }

  this.emailError = '';
  // ✅ Si pasa la validación, continúa con tu lógica
  this.enviado = true;
  }

  volverAlLogin() {
    this.router.navigate(['/auth/login']);
  }
}
