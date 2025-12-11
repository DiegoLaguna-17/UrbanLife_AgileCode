import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

// Interfaces
export interface Trabajador {
  id_trabajador: number;
  fecha_inicio: string;
  fecha_fin: string;
  puesto: string;
  salario: number;
  contrato: string;
  activo: boolean;
  id_proyecto: number;
  justificacion_deshabilitado?: string;
  fecha_deshabilitado?: string;
}

export interface TrabajadorSelect {
  id_trabajador: number;
  nombre: string;
}

export interface Proyecto {
  id_proyecto: number;
  nombre: string;
  estado: string;
  departamento: string;
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
  selector: 'app-ver-trabajador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './ver-trabajador.html',
  styleUrl: './ver-trabajador.scss'
})
export class VerTrabajador implements OnInit {
  formulario: FormGroup;
  formDeshabilitar: FormGroup;
  trabajador: Trabajador | null = null;
  trabajadoresLista: TrabajadorSelect[] = [];
  proyectoAsignado: Proyecto | null = null;
  
  // Estados
  modoEdicion = false;
  cargando = true;
  procesando = false;
  procesandoDeshabilitar = false;
  error = '';
  datosOriginales: any = {};
  
  // Estados de modales
  mostrarModalExito = false;
  mostrarModalError = false;
  mostrarModalConfirmacionCancelar = false;
  mostrarModalDeshabilitarFlag = false;
  mostrarModalConfirmacionDeshabilitar = false;
  
  // Datos para deshabilitación
  justificacionDeshabilitar = '';
  fechaDeshabilitacion = new Date();
  
  // Mensajes de modales
  mensajeExito = '';
  mensajeError = '';
  
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    // Formulario principal
    this.formulario = this.fb.group({
      id_trabajador: [{ value: '', disabled: true }, Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      puesto: ['', [Validators.required, Validators.minLength(3)]],
      salario: ['', [Validators.required, Validators.min(0)]],
      contrato: ['', [Validators.required, Validators.minLength(3)]]
    }, { validators: fechaValidaValidator });
    
    // Formulario para deshabilitar
    this.formDeshabilitar = this.fb.group({
      justificacion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.cargarTrabajadoresLista();
    this.cargarTrabajador();
  }

  // Cargar lista de trabajadores para el select
  cargarTrabajadoresLista(): void {
    this.obtenerTrabajadoresLista().subscribe({
      next: (trabajadores) => {
        this.trabajadoresLista = trabajadores;
      },
      error: (err) => {
        console.error('Error al cargar lista de trabajadores:', err);
        // Datos de prueba
        this.trabajadoresLista = [
          { id_trabajador: 1, nombre: 'Juan Pérez' },
          { id_trabajador: 2, nombre: 'María González' },
          { id_trabajador: 3, nombre: 'Carlos Rodríguez' },
          { id_trabajador: 4, nombre: 'Ana López' },
          { id_trabajador: 5, nombre: 'Luis Martínez' },
          { id_trabajador: 6, nombre: 'Laura Sánchez' }
        ];
      }
    });
  }

  // Cargar información del trabajador
  cargarTrabajador(): void {
    this.route.queryParams.subscribe(params => {
      const trabajadorParam = params['trabajador'];
      
      if (trabajadorParam) {
        try {
          this.trabajador = JSON.parse(trabajadorParam);
          this.cargarProyectoAsignado();
          this.cargarFormulario();
          this.guardarDatosOriginales();
          this.cargando = false;
        } catch (e) {
          console.error('Error parsing trabajador:', e);
          this.error = 'Error al cargar la información del trabajador';
          this.cargando = false;
        }
      } else {
        this.error = 'No se encontró información del trabajador';
        this.cargando = false;
      }
    });
  }

  // Cargar proyecto asignado
  cargarProyectoAsignado(): void {
    if (this.trabajador?.id_proyecto) {
      this.obtenerProyecto(this.trabajador.id_proyecto).subscribe({
        next: (proyecto) => {
          this.proyectoAsignado = proyecto;
        },
        error: (err) => {
          console.error('Error al cargar proyecto:', err);
          // Datos de prueba
          this.proyectoAsignado = {
            id_proyecto: this.trabajador!.id_proyecto,
            nombre: `Proyecto ${this.trabajador!.id_proyecto}`,
            estado: 'En progreso',
            departamento: 'Obras Públicas'
          };
        }
      });
    }
  }

  // Cargar datos en el formulario
  cargarFormulario(): void {
    if (this.trabajador) {
      this.formulario.patchValue({
        id_trabajador: this.trabajador.id_trabajador,
        fecha_inicio: this.formatFechaForInput(this.trabajador.fecha_inicio),
        fecha_fin: this.formatFechaForInput(this.trabajador.fecha_fin),
        puesto: this.trabajador.puesto,
        salario: this.trabajador.salario,
        contrato: this.trabajador.contrato
      });
      
      // Deshabilitar todos los campos inicialmente
      Object.keys(this.formulario.controls).forEach(key => {
        this.formulario.get(key)?.disable();
      });
    }
  }

  // Guardar datos originales para comparar cambios
  guardarDatosOriginales(): void {
    this.datosOriginales = { ...this.formulario.getRawValue() };
  }

  // Verificar si hay cambios
  hayCambios(): boolean {
    if (!this.trabajador) return false;
    
    const datosActuales = this.formulario.getRawValue();
    return JSON.stringify(datosActuales) !== JSON.stringify(this.datosOriginales);
  }

  // Obtener nombre del trabajador por ID
  obtenerNombreTrabajador(id: number | undefined): string {
    if (!id) return 'Trabajador no encontrado';
    const trabajador = this.trabajadoresLista.find(t => t.id_trabajador === id);
    return trabajador ? trabajador.nombre : 'Trabajador no encontrado';
  }

  // Métodos de simulación de API
  obtenerTrabajadoresLista(): Observable<TrabajadorSelect[]> {
    return of([
      { id_trabajador: 1, nombre: 'Juan Pérez' },
      { id_trabajador: 2, nombre: 'María González' },
      { id_trabajador: 3, nombre: 'Carlos Rodríguez' },
      { id_trabajador: 4, nombre: 'Ana López' },
      { id_trabajador: 5, nombre: 'Luis Martínez' },
      { id_trabajador: 6, nombre: 'Laura Sánchez' }
    ]);
  }

  obtenerProyecto(id: number): Observable<Proyecto> {
    // Datos de prueba
    return of({
      id_proyecto: id,
      nombre: id === 1 ? 'Renovación Plaza Central' : 
              id === 2 ? 'Sistema de Alumbrado Público' : 
              id === 3 ? 'Programa de Reforestación Urbana' : 
              id === 4 ? 'Modernización Centro Deportivo' :
              id === 5 ? 'Campaña de Salud Comunitaria' :
              'Techado Canchas Municipales',
      estado: id === 6 ? 'Completado' : 'En progreso',
      departamento: id === 1 ? 'Obras Públicas' : 
                   id === 2 ? 'Energía' : 
                   id === 3 ? 'Medio Ambiente' : 
                   id === 4 ? 'Deporte' :
                   id === 5 ? 'Salud' : 'Deporte'
    });
  }

  // Formatear fecha para input date
  formatFechaForInput(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
  }

  // Cálculos
  calcularDuracionContrato(): number {
    if (!this.trabajador?.fecha_inicio || !this.trabajador?.fecha_fin) return 0;
    
    const inicio = new Date(this.trabajador.fecha_inicio);
    const fin = new Date(this.trabajador.fecha_fin);
    const diferenciaMs = fin.getTime() - inicio.getTime();
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  }

  calcularDiasRestantes(): string {
    if (!this.trabajador?.fecha_fin) return 'N/A';
    
    const hoy = new Date();
    const fin = new Date(this.trabajador.fecha_fin);
    const diferenciaMs = fin.getTime() - hoy.getTime();
    const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
    
    if (dias < 0) return 'Vencido';
    if (dias === 0) return 'Vence hoy';
    return `${dias} días`;
  }

  calcularSalarioMensual(): number {
    if (!this.trabajador?.salario) return 0;
    return this.trabajador.salario / 12;
  }

  obtenerFechaRegistro(): string {
    if (!this.trabajador?.fecha_inicio) return 'N/A';
    
    const fecha = new Date(this.trabajador.fecha_inicio);
    return fecha.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Clases CSS dinámicas
  getClaseDiasRestantes(): string {
    const dias = this.calcularDiasRestantes();
    if (dias === 'Vencido') return 'dias-vencido';
    if (dias === 'Vence hoy') return 'dias-hoy';
    if (dias.includes('días')) {
      const numDias = parseInt(dias.split(' ')[0]);
      if (numDias <= 30) return 'dias-pocos';
    }
    return 'dias-normal';
  }

  getClaseEstadoProyecto(): string {
    if (!this.proyectoAsignado) return '';
    
    const estado = this.proyectoAsignado.estado.toLowerCase();
    switch(estado) {
      case 'en progreso': return 'estado-progreso';
      case 'completado': return 'estado-completado';
      case 'planificado': return 'estado-planificado';
      default: return 'estado-default';
    }
  }

  // Métodos de validación
  validarFechas(): void {
    this.formulario.updateValueAndValidity();
  }

  // Métodos de interacción
  activarModoEdicion(): void {
    this.modoEdicion = true;
    // Habilitar campos editables
    ['fecha_inicio', 'fecha_fin', 'puesto', 'salario', 'contrato'].forEach(campo => {
      this.formulario.get(campo)?.enable();
    });
  }

  cancelarEdicion(): void {
    if (this.hayCambios()) {
      this.mostrarModalConfirmacionCancelar = true;
    } else {
      this.desactivarModoEdicion();
    }
  }

  desactivarModoEdicion(): void {
    this.modoEdicion = false;
    // Restaurar datos originales
    this.formulario.patchValue(this.datosOriginales);
    // Deshabilitar todos los campos
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.disable();
    });
  }

  guardarCambios(): void {
    if (this.formulario.invalid) {
      this.marcarCamposComoTouched();
      return;
    }

    this.procesando = true;
    
    // Simular actualización en API
    setTimeout(() => {
      // Aquí iría la llamada real a tu API
      const datosActualizados = this.formulario.getRawValue();
      console.log('Datos a actualizar:', datosActualizados);
      
      this.procesando = false;
      this.mostrarExitoModal('Los cambios se guardaron exitosamente');
      this.guardarDatosOriginales();
      this.desactivarModoEdicion();
      
      // Actualizar trabajador localmente
      if (this.trabajador) {
        this.trabajador = {
          ...this.trabajador,
          fecha_inicio: datosActualizados.fecha_inicio,
          fecha_fin: datosActualizados.fecha_fin,
          puesto: datosActualizados.puesto,
          salario: datosActualizados.salario,
          contrato: datosActualizados.contrato
        };
      }
    }, 1500);
  }

  volver(): void {
    if (this.modoEdicion && this.hayCambios()) {
      this.mostrarModalConfirmacionCancelar = true;
    } else {
      this.router.navigate(['/administrador/administrar-trabajadores']);
    }
  }

  // Métodos para deshabilitar trabajador
  mostrarModalDeshabilitar(): void {
    if (this.trabajador?.activo) {
      this.formDeshabilitar.reset();
      this.mostrarModalDeshabilitarFlag = true;
    }
  }

  cerrarModalDeshabilitar(): void {
    this.mostrarModalDeshabilitarFlag = false;
    this.formDeshabilitar.reset();
  }

  confirmarDeshabilitar(): void {
    if (this.formDeshabilitar.invalid) {
      this.marcarCamposDeshabilitarComoTouched();
      return;
    }

    this.procesandoDeshabilitar = true;
    const justificacion = this.formDeshabilitar.value.justificacion;
    
    // Simular llamada a API para deshabilitar trabajador
    setTimeout(() => {
      this.procesandoDeshabilitar = false;
      
      // Aquí iría la llamada real a tu API
      // this.http.post('http://127.0.0.1:8000/api/deshabilitar_trabajador', {
      //   id_trabajador: this.trabajador?.id_trabajador,
      //   justificacion: justificacion
      // }).subscribe(...)
      
      // Actualizar estado localmente
      if (this.trabajador) {
        this.trabajador = {
          ...this.trabajador,
          activo: false,
          justificacion_deshabilitado: justificacion,
          fecha_deshabilitado: new Date().toISOString()
        };
      }
      
      this.justificacionDeshabilitar = justificacion;
      this.fechaDeshabilitacion = new Date();
      this.mostrarModalDeshabilitarFlag = false;
      this.mostrarModalConfirmacionDeshabilitar = true;
    }, 2000);
  }

  cerrarModalConfirmacionDeshabilitar(): void {
    this.mostrarModalConfirmacionDeshabilitar = false;
    this.formDeshabilitar.reset();
  }

  // Métodos para modales
  mostrarExitoModal(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.mostrarModalExito = true;
  }

  mostrarErrorModal(mensaje: string): void {
    this.mensajeError = mensaje;
    this.mostrarModalError = true;
  }

  cerrarModalExito(): void {
    this.mostrarModalExito = false;
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
  }

  cerrarModalConfirmacionCancelar(): void {
    this.mostrarModalConfirmacionCancelar = false;
  }

  confirmarCancelar(): void {
    this.mostrarModalConfirmacionCancelar = false;
    this.desactivarModoEdicion();
  }

  // Utilidades
  private marcarCamposComoTouched(): void {
    if (this.modoEdicion) {
      Object.keys(this.formulario.controls).forEach(key => {
        this.formulario.get(key)?.markAsTouched();
      });
    }
  }

  private marcarCamposDeshabilitarComoTouched(): void {
    Object.keys(this.formDeshabilitar.controls).forEach(key => {
      this.formDeshabilitar.get(key)?.markAsTouched();
    });
  }

  // Getters para formulario principal
  get id_trabajador() { return this.formulario.get('id_trabajador'); }
  get fecha_inicio() { return this.formulario.get('fecha_inicio'); }
  get fecha_fin() { return this.formulario.get('fecha_fin'); }
  get puesto() { return this.formulario.get('puesto'); }
  get salario() { return this.formulario.get('salario'); }
  get contrato() { return this.formulario.get('contrato'); }
  
  // Getters para formulario de deshabilitar
  get justificacion() { return this.formDeshabilitar.get('justificacion'); }
}