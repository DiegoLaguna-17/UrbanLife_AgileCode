import { Component, Input,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-card.html',
  styleUrl: './login-card.scss'
})
export class LoginCardComponent {
   // Props que viajan desde el padre
  @Input() username = '';
  @Input() password = '';
  @Input() showErrors = false;
   @Input() isLoading = false;
  

  // Requeridos para [(username)] y [(password)]
  @Output() usernameChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();

  // Eventos de acción hacia el padre
  @Output() loginClicked = new EventEmitter<void>();
  @Output() forgotClicked = new EventEmitter<void>();

  // Propagan cambios al padre
  onUsernameInput(val: string) { this.usernameChange.emit(val); }
  onPasswordInput(val: string) { this.passwordChange.emit(val); }

  emitLogin() { 
    if (!this.isLoading) {
      this.isLoading = true; // activa el spinner
      this.loginClicked.emit();
    }
   }
   stopLoading() {
    this.isLoading = false; // para apagar el spinner después
  }
  emitForgot() { this.forgotClicked.emit(); }

  // Helpers visuales (usados en la vista del hijo)

  isInvalid(user: string, pass: string) {
    return this.showErrors && (!user.trim() || !pass.trim());
  }
showPassword = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}
}
