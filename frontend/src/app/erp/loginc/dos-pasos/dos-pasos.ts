import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dos-pasos',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dos-pasos.html',
  styleUrl: './dos-pasos.scss'
})
export class DosPasos {
  codigo: string = '';
  email: string | null = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.email = sessionStorage.getItem('email');
    console.log('Email desde sessionStorage:', this.email);
  }

  soloNumeros(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
    }
  }

  limitarCodigo(): void {
    if (this.codigo.length > 6) {
      this.codigo = this.codigo.slice(0, 6);
    }
  }

  verificar() {
    if (!this.email) {
      alert('No se encontró el correo en sesión');
      return;
    }

    if (this.codigo.length !== 6) {
      alert('El código debe tener 6 dígitos');
      return;
    }

    const payload = {
      correo: this.email,
      codigo: this.codigo
    };
 

    this.http.post('http://127.0.0.1:8000/api/verify-2fa', payload)
      .subscribe({
        next: (res: any) => {
          console.log('Respuesta del servidor:', res);
          if (res.access_token) {
            sessionStorage.setItem('acces_token',res.access_token);
            alert('✅ Verificación correcta');
            // Guardar datos si es necesario
            switch(sessionStorage.getItem('id_rol')){
              case '3':
                this.router.navigate(['/administrador'])
                break;
              case '4':
                this.router.navigate(['/contador'])
                break;
              case '5':
                this.router.navigate(['/rrhh'])
                break;
              case '6':
                this.router.navigate(['/jefeobra'])
              break;
            }
          } else {
            alert('Código incorrecto o expirado');
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al verificar 2FA:', error);
          switch (error.status) {
            case 400:
              alert('Datos incompletos o inválidos');
              break;
            case 401:
              alert('Código incorrecto o expirado');
              break;
            case 500:
              alert('Error del servidor, intenta más tarde');
              break;
            default:
              alert('Ocurrió un error inesperado');
          }
        }
      });
      
  }
}
