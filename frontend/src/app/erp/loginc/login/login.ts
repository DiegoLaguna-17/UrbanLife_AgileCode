import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LoginCardComponent } from '../componentes/login-card/login-card';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse,HttpClientModule

 } from '@angular/common/http';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,LoginCardComponent,HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username=''
  password = '';
  showErrors = false;

  // Estado del modal
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';
  constructor(private router: Router, private http: HttpClient) {}
  onLogin() {
   if (!this.username.trim() || !this.password.trim()) {
      this.mostrarModal('Campos vacíos', 'Por favor completa todos los campos.');
      return;
    }

    // Llamada al endpoint de login
    const loginData = {
      username: this.username,
      password: this.password
    };
    console.log(loginData);
    sessionStorage.setItem('email',loginData.username);
    /*
    this.http.post('https://tu-api.com/login', loginData, { observe: 'response' })
      .subscribe({
        next: response => {
          // Aquí revisamos el status del servidor
          if (response.status === 200) {
            this.mostrarModal('Credenciales válidas', '');
            sessionStorage.setItem('email',loginData.username);
            setTimeout(() => {
              this.cerrarModal();
              this.router.navigate(['/auth/verificacion']);
            }, 1500);
          }
        },
        error: (error: HttpErrorResponse) => {
          // Manejo de errores según el código HTTP
          switch (error.status) {
            case 400:
              this.mostrarModal('Credenciales inválidas', 'Usuario o contraseña incorrectos.');
              break;
            case 403:
              this.mostrarModal('Usuario bloqueado', 'Has excedido el número de intentos permitidos.');
              break;
            case 500:
              this.mostrarModal('Error del servidor', 'Intenta más tarde.');
              break;
            default:
              this.mostrarModal('Error', 'Ocurrió un error inesperado.');
              break;
          }
        }
      });*/
      this.router.navigate(['/auth/verificacion'])
      
  }

  onForgotPassword() {
    this.router.navigate(['/auth/recuperar']);
  }
  onBackHome(){
    this.router.navigate(['/']);
  }
    mostrarModal(titulo: string, mensaje: string) {
    this.modalTitle = titulo;
    this.modalMessage = mensaje;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }
 
}
