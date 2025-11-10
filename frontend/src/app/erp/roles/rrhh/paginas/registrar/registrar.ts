import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar.html',
  styleUrl: './registrar.scss'
})
export class Registrar {
  registroForm: FormGroup;
  contratoArchivo: File | null = null;

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      puesto: ['', [Validators.required, Validators.minLength(3)]],
      contrato: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea PDF
      if (file.type === 'application/pdf') {
        this.contratoArchivo = file;
        this.contrato?.setValue(file.name);
        this.contrato?.markAsTouched();
      } else {
        alert('Por favor, seleccione un archivo PDF');
        this.contratoArchivo = null;
        this.contrato?.setValue('');
      }
    }
  }

  onSubmit(): void {
    if (this.registroForm.valid && this.contratoArchivo) {
      const empleadoData = {
        ...this.registroForm.value,
        contratoArchivo: this.contratoArchivo
      };
      
      console.log('Datos del empleado:', empleadoData);
      
      // Aquí puedes enviar los datos al servidor
      // Por ejemplo, usando un servicio HTTP
      
      this.registroForm.reset();
      this.contratoArchivo = null;
      alert('Empleado registrado exitosamente!');
    } else {
      this.marcarCamposComoTouched();
    }
  }

  private marcarCamposComoTouched(): void {
    Object.keys(this.registroForm.controls).forEach(key => {
      this.registroForm.get(key)?.markAsTouched();
    });
  }

  // Getters para fácil acceso en el template
  get nombre() { return this.registroForm.get('nombre'); }
  get puesto() { return this.registroForm.get('puesto'); }
  get contrato() { return this.registroForm.get('contrato'); }
}
