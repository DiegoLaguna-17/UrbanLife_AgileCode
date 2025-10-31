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
      correo: this.username,
      contrasenia: this.password
    };
    console.log(loginData);
    sessionStorage.setItem('email',loginData.correo);
    
    this.http.post('http://127.0.0.1:8000/api/login', loginData, { observe: 'response' })
      .subscribe({
        next: (res: any) => {
          // Guardamos el correo en sessionStorage
          sessionStorage.setItem('email', loginData.correo);
          console.log(sessionStorage.getItem('email'))
          const user = res.body?.user;
          if (user) {
            sessionStorage.setItem('id_usuario', user.id_usuario.toString());
            sessionStorage.setItem('id_rol', user.rol_id_rol.toString());
            console.log(user.rol_id_rol.toString())
          }

          this.mostrarModal('Código enviado', 'Revisa tu correo para ingresar el código de verificación.');
          setTimeout(() => {
            this.cerrarModal();
            this.router.navigate(['/auth/verificacion']); // Ruta de verificación 2FA
          }, 1500);
        },
        error: (error: HttpErrorResponse) => {
          // Manejo de errores según el código HTTP
          switch (error.status) {
            case 401:
              this.mostrarModal('Credenciales inválidas', 'Usuario o contraseña incorrectos.');
              break;
            case 429:
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
      });
      
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
