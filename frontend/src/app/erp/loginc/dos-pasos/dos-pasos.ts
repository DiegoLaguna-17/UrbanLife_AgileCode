import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dos-pasos',
  imports: [CommonModule, FormsModule],
  templateUrl: './dos-pasos.html',
  styleUrl: './dos-pasos.scss'
})
export class DosPasos {
  codigo = '';

  verificar() {
    if (this.codigo === '123456') {
      console.log('✅ Verificación correcta');
      // Aquí podrías redirigir al dashboard
    } else {
      alert('Código incorrecto');
    }
  }
}
