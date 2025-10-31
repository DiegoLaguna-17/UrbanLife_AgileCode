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
  ngOnInit(){
    const email=sessionStorage.getItem('email');
    console.log(email)
  }
  codigo: string = '';

soloNumeros(event: KeyboardEvent): void {
  const char = event.key;
  // Bloquear todo lo que no sea un número
  if (!/^[0-9]$/.test(char)) {
    event.preventDefault();
  }
}

limitarCodigo(): void {
  // Asegura que el valor no supere los 6 caracteres
  if (this.codigo.length > 6) {
    this.codigo = this.codigo.slice(0, 6);
  }
}

  verificar() {
    if (this.codigo === '123456') {
      console.log('✅ Verificación correcta');
      // Aquí podrías redirigir al dashboard
    } else {
      alert('Código incorrecto');
    }
  }
}
