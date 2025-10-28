import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LoginCardComponent } from '../componentes/login-card/login-card';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,LoginCardComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username=''
 password = '';
  showErrors = false;
  constructor(private router: Router) {}
  onLogin() {
    this.showErrors = true;

    if (!this.username.trim() || !this.password.trim()) {
      console.warn('Campos vacíos');
      return;
    }

    // 💡 Aquí tu lógica real (API, routing, etc.)
    console.log('Login  en login correcto con:', this.username, this.password);
    this.router.navigate(['/auth/verificacion']);
  }

  onForgotPassword() {
    this.router.navigate(['/auth/recuperar']);
  }
  onBackHome(){
    this.router.navigate(['/']);
  }
 
}
