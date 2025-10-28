import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-cambiar-contra',
  imports: [CommonModule, FormsModule],
  templateUrl: './card-cambiar-contra.html',
  styleUrl: './card-cambiar-contra.scss'
})
export class CardCambiarContra {
 newPassword = '';
  confirmPassword = '';
  showPassword = false;
  error = '';
  success = '';

  @Output() passwordChanged = new EventEmitter<void>();

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
 showPassword2 = false;

togglePassword2() {
  this.showPassword2 = !this.showPassword2;
}


    canChangePassword(): boolean {
    return this.newPassword.length >= 6 && this.newPassword === this.confirmPassword;
  }

  changePassword() {
    if (!this.canChangePassword()) {
      this.error = 'Contraseñas no coinciden o muy cortas';
      return;
    }
    this.error = '';
    this.success = 'Contraseña cambiada correctamente!';
    // Aquí llamas al backend para actualizar la contraseña
    this.passwordChanged.emit();
  }
}
