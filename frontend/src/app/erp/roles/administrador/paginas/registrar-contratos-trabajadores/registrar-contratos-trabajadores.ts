import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

// Interfaces
export interface TrabajadorSelect {
  id_trabajador: number;
  nombre: string;
}

// Validador personalizado para fechas
function fechaValidaValidator(control: AbstractControl): ValidationErrors | null {
  const fechaInicio = control.get('fecha_inicio')?.value;
  const fechaFin = control.get('fecha_fin')?.value;

  if (fechaInicio && fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    if (fin <= inicio) {
      return { fechaInvalida: true };
    }
  }
  return null;
}

@Component({
  selector: 'app-registrar-contratos-trabajadores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registrar-contratos-trabajadores.html',
  styleUrl: './registrar-contratos-trabajadores.scss'
})
export class RegistrarContratosTrabajadores implements OnInit {
  registroForm: FormGroup;
  contratoArchivo: File | null = null;
  trabajadores: TrabajadorSelect[] = [];
  loading = true;
  procesando = false;
  
  // Estados de modales
  mostrarModalExito = false;
  mostrarModalError = false;
  mostrarModalConfirmacionCancelar = false;
  mostrarModalValidacionArchivo = false;
  
  // Mensajes de modales
  mensajeExito = '';
  mensajeError = '';
  
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.registroForm = this.fb.group({
      id_trabajador: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      puesto: ['', [Validators.required, Validators.minLength(3)]],
      salario: ['', [Validators.required, Validators.min(0)]],
      contrato: ['', Validators.required]
    }, { validators: fechaValidaValidator });
  }

  ngOnInit(): void {
    this.cargarTrabajadores();
  }

  // Cargar trabajadores desde el endpoint
  cargarTrabajadores(): void {
    this.obtenerTrabajadores().subscribe({
      next: (trabajadores) => {
        this.trabajadores = trabajadores;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar trabajadores:', err);
        // Datos de prueba si falla la API
        this.trabajadores = [
          { id_trabajador: 1, nombre: 'Juan Pérez' },
          { id_trabajador: 2, nombre: 'María González' },
          { id_trabajador: 3, nombre: 'Carlos Rodríguez' },
          { id_trabajador: 4, nombre: 'Ana López' },
          { id_trabajador: 5, nombre: 'Luis Martínez' },
          { id_trabajador: 6, nombre: 'Laura Sánchez' }
        ];
        this.loading = false;
        this.mostrarErrorModal('No se pudieron cargar los trabajadores. Usando datos de prueba.');
      }
    });
  }

  obtenerTrabajadores(): Observable<TrabajadorSelect[]> {
    // Endpoint real
    // return this.http.get<TrabajadorSelect[]>('http://127.0.0.1:8000/api/trabajadores');
    
    // Datos de prueba
    return of([
      { id_trabajador: 1, nombre: 'Juan Pérez' },
      { id_trabajador: 2, nombre: 'María González' },
      { id_trabajador: 3, nombre: 'Carlos Rodríguez' },
      { id_trabajador: 4, nombre: 'Ana López' },
      { id_trabajador: 5, nombre: 'Luis Martínez' },
      { id_trabajador: 6, nombre: 'Laura Sánchez' },
      { id_trabajador: 7, nombre: 'Roberto Díaz' },
      { id_trabajador: 8, nombre: 'Carmen Ruiz' }
    ]);
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
        this.contratoArchivo = null;
        this.contrato?.setValue('');
        this.mostrarModalValidacionArchivo = true;
      }
    }
  }

  validarFechas(): void {
    this.registroForm.updateValueAndValidity();
  }

  async onSubmit(): Promise<void> {
    if (this.registroForm.invalid || !this.contratoArchivo) {
      this.marcarCamposComoTouched();
      if (!this.contratoArchivo) {
        this.mostrarErrorModal('Debe seleccionar un archivo PDF para el contrato.');
      }
      return;
    }

    this.procesando = true;

    // Formatear las fechas si es necesario
    const formValue = this.registroForm.value;
    
    // Crear FormData para enviar archivo
    const formData = new FormData();
    formData.append('id_trabajador', formValue.id_trabajador.toString());
    formData.append('fecha_inicio', formValue.fecha_inicio);
    formData.append('fecha_fin', formValue.fecha_fin);
    formData.append('puesto', formValue.puesto);
    formData.append('salario', formValue.salario.toString());
    formData.append('contrato', this.contratoArchivo);

    // Aquí iría la llamada a tu API
    this.registrarContrato(formData);
  }

  registrarContrato(formData: FormData): void {
    // Endpoint para registrar el contrato
    const url = 'http://127.0.0.1:8000/api/registrar_contrato_trabajador';
    
    this.http.post(url, formData).subscribe({
      next: (respuesta: any) => {
        console.log('Contrato registrado:', respuesta);
        this.procesando = false;
        this.mostrarExitoModal('Contrato registrado exitosamente');
      },
      error: (err) => {
        console.error('Error al registrar contrato:', err);
        this.procesando = false;
        this.mostrarErrorModal(
          err.error?.message || 
          'Error al registrar el contrato. Por favor, intente nuevamente.'
        );
      }
    });
  }

  // Métodos para mostrar modales
  mostrarExitoModal(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.mostrarModalExito = true;
  }

  mostrarErrorModal(mensaje: string): void {
    this.mensajeError = mensaje;
    this.mostrarModalError = true;
  }

  mostrarModalCancelar(): void {
    this.mostrarModalConfirmacionCancelar = true;
  }

  // Métodos para cerrar modales
  cerrarModalExito(): void {
    this.mostrarModalExito = false;
    this.router.navigate(['/administrador/administrar-trabajadores']);
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
  }

  cerrarModalConfirmacionCancelar(): void {
    this.mostrarModalConfirmacionCancelar = false;
  }

  cerrarModalValidacionArchivo(): void {
    this.mostrarModalValidacionArchivo = false;
  }

  confirmarCancelar(): void {
    this.mostrarModalConfirmacionCancelar = false;
    this.router.navigate(['/administrador/administrar-trabajadores']);
  }

  private marcarCamposComoTouched(): void {
    Object.keys(this.registroForm.controls).forEach(key => {
      this.registroForm.get(key)?.markAsTouched();
    });
  }

  // Getters para fácil acceso en el template
  get id_trabajador() { return this.registroForm.get('id_trabajador'); }
  get fecha_inicio() { return this.registroForm.get('fecha_inicio'); }
  get fecha_fin() { return this.registroForm.get('fecha_fin'); }
  get puesto() { return this.registroForm.get('puesto'); }
  get salario() { return this.registroForm.get('salario'); }
  get contrato() { return this.registroForm.get('contrato'); }
}