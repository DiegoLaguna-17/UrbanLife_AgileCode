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

  constructor(private router: Router) {}

  onEnviar() {
    if (!this.email.trim()) return;
    this.enviado = true;
    console.log('🔹 Se enviaron las instrucciones a:', this.email);
  }

  volverAlLogin() {
    this.router.navigate(['/auth/login']);
  }
}
