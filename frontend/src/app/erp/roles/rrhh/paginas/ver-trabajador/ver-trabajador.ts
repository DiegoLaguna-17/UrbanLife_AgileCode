import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Trabajador } from '../../componentes/card-trabajador/card-trabajador';

// Validador personalizado para mayor de edad (COPIADO DE REGISTRAR-TRABAJADORES)
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
  selector: 'app-ver-trabajador',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ver-trabajador.html',
  styleUrl: './ver-trabajador.scss'
})
export class VerTrabajador implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  trabajador: Trabajador | null = null;
  trabajadorForm!: FormGroup;
  modoEdicion: boolean = false;
  formularioModificado: boolean = false;
  mostrarModal: boolean = false;
  datosOriginales: any = null;
  
  // NUEVO: Fecha máxima para el date picker (hoy - 18 años)
  fechaMaxima: string;

  constructor() {
    // Calcular fecha máxima (hace 18 años desde hoy)
    const hoy = new Date();
    const fechaMax = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
    this.fechaMaxima = fechaMax.toISOString().split('T')[0];

    // Obtener los datos del trabajador del estado de la navegación
    const navigation = this.router.getCurrentNavigation();
    this.trabajador = navigation?.extras?.state?.['trabajador'] || null;
    
    if (!this.trabajador) {
      console.error('No se recibió información del trabajador');
    }
  }

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    if (this.trabajador) {
      this.trabajadorForm = this.fb.group({
        nombre: [this.trabajador.nombre, [Validators.required, Validators.minLength(3)]],
        fecha_nac: [this.formatearFechaParaInput(this.trabajador.fecha_nac), [Validators.required, mayorDeEdadValidator]],
        experiencia: [this.trabajador.experiencia, [Validators.required, Validators.minLength(10), Validators.maxLength(100)]]
      });

      // Guardar datos originales para comparar
      this.datosOriginales = this.trabajadorForm.value;

      // Escuchar cambios en el formulario
      this.trabajadorForm.valueChanges.subscribe(() => {
        this.verificarCambios();
      });
    }
  }

  // Formatear fecha para el input date
  formatearFechaParaInput(fecha: string): string {
    if (!fecha) return '';
    
    try {
      const date = new Date(fecha);
      return date.toISOString().split('T')[0];
    } catch {
      return fecha;
    }
  }

  // Formatear fecha para mostrar
  formatearFecha(fecha: string): string {
    if (!fecha) return 'No especificada';
    
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  }

  // Verificar si el formulario ha sido modificado
  verificarCambios() {
    if (this.datosOriginales) {
      this.formularioModificado = JSON.stringify(this.trabajadorForm.value) !== JSON.stringify(this.datosOriginales);
    }
  }

  // Manejar el clic en el botón de actualizar/cancelar/guardar
  manejarActualizacion() {
    if (!this.modoEdicion) {
      // Activar modo edición
      this.activarEdicion();
    } else if (this.modoEdicion && !this.formularioModificado) {
      // Cancelar edición
      this.cancelarEdicion();
    } else if (this.modoEdicion && this.formularioModificado) {
      // Guardar cambios
      this.guardarCambios();
    }
  }

  activarEdicion() {
    this.modoEdicion = true;
    this.formularioModificado = false;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.formularioModificado = false;
    // Restaurar datos originales
    this.trabajadorForm.patchValue(this.datosOriginales);
  }

  guardarCambios() {
    if (this.trabajadorForm.valid) {
      // Aquí iría la llamada al servicio para actualizar en el backend
      console.log('Datos a actualizar:', this.trabajadorForm.value);
      
      // Simular actualización exitosa
      this.mostrarModal = true;
      this.modoEdicion = false;
      this.formularioModificado = false;
      
      // Actualizar datos originales con los nuevos valores
      this.datosOriginales = this.trabajadorForm.value;
      
      // Actualizar también el objeto trabajador
      if (this.trabajador) {
        this.trabajador = {
          ...this.trabajador,
          ...this.trabajadorForm.value
        };
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.trabajadorForm.controls).forEach(key => {
        this.trabajadorForm.get(key)?.markAsTouched();
      });
    }
  }

  // Obtener el texto del botón según el estado
  obtenerTextoBoton(): string {
    if (!this.modoEdicion) {
      return 'Actualizar';
    } else if (this.modoEdicion && !this.formularioModificado) {
      return 'Cancelar';
    } else {
      return 'Guardar';
    }
  }

  // Asignar obra (sin acción por el momento)
  asignarObra() {
    console.log('Función asignar obra - pendiente de implementar');
    // Aquí puedes implementar la lógica para asignar obra
  }

  // Cerrar modal
  cerrarModal() {
    this.mostrarModal = false;
  }

  volver() {
    this.router.navigate(['/rrhh/administrar-trabajadores']);
  }

  // Getters para fácil acceso a los controles del formulario
  get nombre() { return this.trabajadorForm.get('nombre'); }
  get fecha_nac() { return this.trabajadorForm.get('fecha_nac'); }
  get experiencia() { return this.trabajadorForm.get('experiencia'); }
}