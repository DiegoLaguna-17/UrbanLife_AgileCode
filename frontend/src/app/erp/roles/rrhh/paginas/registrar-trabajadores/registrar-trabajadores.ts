import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient,HttpClientModule } from '@angular/common/http';
// Validador personalizado para mayor de edad (SE MANTIENE IGUAL)
export function mayorDeEdadValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null; // No validar si está vacío (ya hay required)
  }

  const fechaNacimiento = new Date(control.value);
  const hoy = new Date();
  
  // Calcular edad
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  
  // Ajustar si aún no ha cumplido años este año
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  
  // Verificar si es mayor de edad (18 años)
  if (edad < 18) {
    return { menorEdad: true };
  }
  
  return null;
}

@Component({
  selector: 'app-registrar-trabajadores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './registrar-trabajadores.html',
  styleUrl: './registrar-trabajadores.scss'
})
export class RegistrarTrabajadores {
  registroForm: FormGroup;
  private router = inject(Router);
    private http = inject(HttpClient);
  private loading:Boolean=false;
  private error:String='';
  
  // Fecha máxima para el date picker (hoy - 18 años) - SE MANTIENE IGUAL
  fechaMaxima: string;

  // Nuevas variables para controlar modales
  mostrarModalExito: boolean = false;
  mostrarModalError: boolean = false;

  constructor(private fb: FormBuilder) {
    // Calcular fecha máxima (hace 18 años desde hoy) - SE MANTIENE IGUAL
    const hoy = new Date();
    const fechaMax = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
    this.fechaMaxima = fechaMax.toISOString().split('T')[0];

    //VALIDACIONES DE LOS CAMPOS
    this.registroForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
      fechaNacimiento: ['', [Validators.required, mayorDeEdadValidator]],
      experiencia: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  // Método para volver a la página principal de rrhh - SE MANTIENE IGUAL
  volver(): void {
    this.router.navigate(['/rrhh/administrar-trabajadores']);
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      const trabajadorData = {
        ...this.registroForm.value,
        // Formatear la fecha para el backend si es necesario
        fecha_nac: this.formatearFechaParaBackend(this.registroForm.value.fechaNacimiento)
      };
      
      console.log('Datos del trabajador:', trabajadorData);
      
      // Aquí vamos a enviar al back
      
      // Mostrar datos en consola para prueba
      console.log('📋 Datos a enviar al backend:');
      console.log('Nombre:', trabajadorData.nombreCompleto);
      console.log('Fecha Nacimiento:', trabajadorData.fechaNacimiento);
      console.log('Experiencia:', trabajadorData.experiencia);
      
      this.registroForm.reset();
      const trabajador={
        nombre:trabajadorData.nombreCompleto,
        fecha_nac:trabajadorData.fechaNacimiento,
        experiencia:trabajadorData.experiencia
      }
      this.registrarTrabajador(trabajador);
      // CAMBIO: En lugar de alert, mostramos modal de éxito
      
      
    } else {
      this.marcarCamposComoTouched();
      
      // CAMBIO: En lugar de alert, mostramos modal de error
    }
  }

  // Nuevos métodos para manejar modales
  cerrarModalExito(): void {
    this.mostrarModalExito = false;
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
  }

  // Formatear fecha para el backend (opcional) - SE MANTIENE IGUAL
  private formatearFechaParaBackend(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  private marcarCamposComoTouched(): void {
    Object.keys(this.registroForm.controls).forEach(key => {
      this.registroForm.get(key)?.markAsTouched();
    });
  }
  registrarTrabajador(trabajadorData:any,){
    this.loading = true;
  this.error = '';
  this.http.post("http://127.0.0.1:8000/api/registrar_trabajador", trabajadorData)
    .subscribe({
      next: (respuesta) => {
        console.log("Registrado correctamente:", respuesta);
        this.loading = false;
        this.mostrarModalExito = true;
        
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 422) {
          this.error = "Datos inválidos";
          console.log("Errores 422:", err.error);
        } else {
          this.error = "Error al registrar trabajador";
          console.log(err);
        }
        this.mostrarModalError = true;
      }
    });
  }

  // Getters para fácil acceso en el template - SE MANTIENEN IGUAL
  get nombreCompleto() { return this.registroForm.get('nombreCompleto'); }
  get fechaNacimiento() { return this.registroForm.get('fechaNacimiento'); }
  get experiencia() { return this.registroForm.get('experiencia'); }
}