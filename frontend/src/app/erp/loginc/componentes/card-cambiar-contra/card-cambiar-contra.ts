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
  showPassword2 = false;
  error = '';
  success = '';

  @Output() passwordChanged = new EventEmitter<void>();

  togglePassword() { this.showPassword = !this.showPassword; }
  togglePassword2() { this.showPassword2 = !this.showPassword2; }

  /**
   * Requisitos:
   * - Mínimo 8 caracteres
   * - Al menos una mayúscula
   * - Al menos una minúscula
   * - Al menos un número o símbolo
   */
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
      this.success = '';
      return;
    }

    if (!this.isPasswordStrong(this.newPassword)) {
      this.error =
        'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y un número o símbolo.';
      this.success = '';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      this.success = '';
      return;
    }

    // ✅ Si todo va bien
    this.error = '';
    this.success = '¡Contraseña cambiada correctamente!';
    this.passwordChanged.emit();

    // Aquí puedes llamar a tu backend para actualizar la contraseña
  }
}
