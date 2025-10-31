import { Component } from '@angular/core';
import { NgForm, FormsModule, EmailValidator } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
export interface Mensaje{
  nombre:String;
  correo:String;
  mensaje:string;
}
@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.scss']
})
export class Contacto {
  constructor(private http: HttpClient) {}
  correoValido: boolean = true;

  // Validar correo con expresión regular
  validarCorreo(correo: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  this.correoValido = regex.test(correo);
}

enviarFormulario(form: NgForm) {
  const { nombre, correo, detalle } = form.value;
  this.validarCorreo(correo);

  if (form.valid && this.correoValido) {
     const mensaje: Mensaje = {
        nombre,
        correo,
        mensaje: detalle
      };
      console.log(mensaje);
      /*
      this.http.post('http://127.0.0.1:8000/api/mensaje', mensaje)
      .subscribe({
        next: (response) => {
          console.log('Formulario enviado:', response);
          // Aquí puedes mostrar mensaje de éxito al usuario
        },
        error: (error) => {
          console.error('Error al enviar:', error);
          // Aquí puedes mostrar mensaje de error al usuario
        }
      });
*/

      form.resetForm();
      this.correoValido = true;
  } else {
    console.log('Formulario inválido, revisa los campos.');
  }
}

}
