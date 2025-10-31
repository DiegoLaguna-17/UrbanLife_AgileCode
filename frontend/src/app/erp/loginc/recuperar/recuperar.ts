import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './recuperar.html',
  styleUrls: ['./recuperar.scss']  
})
export class RecuperarComponent {
  email = '';
  enviado = false;
  emailError: string = '';
  mensaje: string = '';

  constructor(private router: Router, private http: HttpClient) {}

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

    // Consumir endpoint de forgot password
    const payload = { correo: this.email };
    this.http.post('http://127.0.0.1:8000/api/forgot-password', payload)
      .subscribe({
        next: (res: any) => {
          console.log('Respuesta del servidor:', res);
          this.mensaje = 'Se ha enviado un correo con el enlace para restablecer tu contraseña.';
          this.enviado = true;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al solicitar recuperación de contraseña:', error);
          if (error.status === 404) {
            this.emailError = 'Correo no registrado';
          } else {
            this.emailError = 'Ocurrió un error, intenta nuevamente más tarde';
          }
        }
      });
  }

  volverAlLogin() {
    this.router.navigate(['/auth/login']);
  }
}
