import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-cambiar-contra',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './card-cambiar-contra.html',
  styleUrl: './card-cambiar-contra.scss'
})
export class CardCambiarContra implements OnInit {
  newPassword = '';
  confirmPassword = '';
  showPassword = false;
  showPassword2 = false;
  error = '';
  modalVisible:boolean=false;

  token = '';
  email = '';
   modalTitle = '';
  modalMessage = '';

  @Output() passwordChanged = new EventEmitter<void>();

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.modalVisible=false;
    // Capturar token y email desde la URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      console.log('Token:', this.token, 'Email:', this.email);
    });
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  togglePassword2() { this.showPassword2 = !this.showPassword2; }

  private isPasswordStrong(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;
    return regex.test(password);
  }

  canChangePassword(): boolean {
    return (
      this.isPasswordStrong(this.newPassword) &&
      this.newPassword === this.confirmPassword
    );
  }

  changePassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Por favor, completa ambos campos.';
      return;
    }

    if (!this.isPasswordStrong(this.newPassword)) {
      this.error =
        'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y un número o símbolo.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    // ✅ Consumir el endpoint de reset password
    const payload = {
      correo: this.email,
      token: this.token,
      nueva_contrasenia: this.newPassword,
      nueva_contrasenia_confirmation: this.confirmPassword // si tu backend usa 'confirmed'
    };

    this.http.post('http://127.0.0.1:8000/api/reset-password', payload)
      .subscribe({
        next: (res: any) => {
          this.error = '';
          this.passwordChanged.emit();
          this.mostrarModal('Cambio de contraseña exitoso','Ya puedes cerrar esta pestaña');

        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al cambiar contraseña:', err);
          this.error = err.error?.error || 'Ocurrió un error al cambiar la contraseña.';
          this.mostrarModal('Error al cambiar contraseña','Comunicarse con soporte técnico')
        }
      });
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
