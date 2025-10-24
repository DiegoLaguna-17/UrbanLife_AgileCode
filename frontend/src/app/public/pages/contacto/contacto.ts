import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.scss']
})
export class Contacto {
  nombre = '';
  correo = '';
  detalle = '';

  enviarFormulario(form: NgForm) {
    form.control.markAllAsTouched();

    if (form.valid) {
      alert(`Formulario enviado:
      Nombre: ${this.nombre}
      Correo: ${this.correo}
      Detalle: ${this.detalle}`);
      form.resetForm();
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }
}
