import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registrar-actividad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registrar-actividad.html',
  styleUrl: './registrar-actividad.scss'
})
export class RegistrarActividadComponent {
  registroForm: FormGroup;
  private router = inject(Router);
  private http = inject(HttpClient);
  
  // Variables de control
  pasoActual: number = 1;
  mostrarModalExito: boolean = false;
  mostrarModalError: boolean = false;
  mensajeError: string = '';
  loading: boolean = false;
  
  // Datos para los selects
  empleadosDisponibles: any[] = [
    { id_empleado: 1, nombre: "Juan" },
    { id_empleado: 2, nombre: "María" },
    { id_empleado: 3, nombre: "Carlos" },
    { id_empleado: 4, nombre: "Ana" }
  ];
  
  materialesDisponibles: any[] = [
    { id_material_almacen: 1, nombre: "Ladrillo", cantidad: 100 },
    { id_material_almacen: 2, nombre: "Cemento", cantidad: 50 },
    { id_material_almacen: 3, nombre: "Arena", cantidad: 200 },
    { id_material_almacen: 4, nombre: "Pintura", cantidad: 30 }
  ];

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      // Paso 1: Datos básicos (OBLIGATORIOS)
      nombre_actividad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      fecha_realizacion: ['', [Validators.required, this.fechaFuturaValidator]],
      
      // Paso 2: Empleados (OPCIONAL) - Inicialmente vacío
      empleados: this.fb.array([]),
      
      // Paso 3: Materiales (OPCIONAL) - Inicialmente vacío
      materiales: this.fb.array([])
    });
  }

  // Getters para los FormArrays
  get empleadosArray(): FormArray {
    return this.registroForm.get('empleados') as FormArray;
  }

  get materialesArray(): FormArray {
    return this.registroForm.get('materiales') as FormArray;
  }

  // Getters para fácil acceso a los controles
  get nombre_actividad() { return this.registroForm.get('nombre_actividad'); }
  get descripcion() { return this.registroForm.get('descripcion'); }
  get fecha_realizacion() { return this.registroForm.get('fecha_realizacion'); }

  // Método para crear un grupo de formulario para empleado (OPCIONAL)
  crearFormGroupEmpleado(): FormGroup {
    return this.fb.group({
      id_empleado: [''] // Sin Validators.required
    });
  }

  // Método para crear un grupo de formulario para material (OPCIONAL)
  crearFormGroupMaterial(): FormGroup {
    return this.fb.group({
      id_material_almacen: [''], // Sin Validators.required
      cantidad: [''] // Validación dinámica solo si hay material seleccionado
    });
  }

  // Validador personalizado para fecha futura
  fechaFuturaValidator(control: any) {
    if (!control.value) {
      return null;
    }
    
    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
      return { minDate: true };
    }
    return null;
  }

  // Validar solo el paso 1 (campos obligatorios)
  esPaso1Valido(): boolean {
    return !!this.nombre_actividad?.valid && 
          !!this.descripcion?.valid && 
          !!this.fecha_realizacion?.valid;
  }

  // Navegación entre secciones
  irASeccionEmpleados(): void {
    if (this.esPaso1Valido()) {
      // Solo agregar un empleado si no hay ninguno
      if (this.empleadosArray.length === 0) {
        this.agregarEmpleado();
      }
      this.pasoActual = 2;
    } else {
      this.marcarCamposPaso1ComoTouched();
      this.mostrarModalError = true;
      this.mensajeError = 'Complete todos los campos obligatorios antes de continuar';
    }
  }

  irASeccionMateriales(): void {
    if (this.esPaso1Valido()) {
      // Solo agregar un material si no hay ninguno
      if (this.materialesArray.length === 0) {
        this.agregarMaterial();
      }
      this.pasoActual = 3;
    } else {
      this.marcarCamposPaso1ComoTouched();
      this.mostrarModalError = true;
      this.mensajeError = 'Complete todos los campos obligatorios antes de continuar';
    }
  }

  volverAPaso1(): void {
    this.pasoActual = 1;
  }

  // Métodos para empleados
  agregarEmpleado(): void {
    this.empleadosArray.push(this.crearFormGroupEmpleado());
  }

  eliminarEmpleado(index: number): void {
    this.empleadosArray.removeAt(index);
  }

  // Métodos para materiales
  agregarMaterial(): void {
    this.materialesArray.push(this.crearFormGroupMaterial());
  }

  eliminarMaterial(index: number): void {
    this.materialesArray.removeAt(index);
  }

  onMaterialSeleccionado(event: any, index: number): void {
    const materialId = event.target.value;
    const cantidadControl = this.materialesArray.at(index).get('cantidad');
    
    if (materialId) {
      const material = this.materialesDisponibles.find(m => m.id_material_almacen == materialId);
      if (material) {
        // Solo agregar validadores si hay material seleccionado
        cantidadControl?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(material.cantidad)
        ]);
      }
    } else {
      // Si no hay material seleccionado, quitar validadores
      cantidadControl?.clearValidators();
      cantidadControl?.setValue(''); // Limpiar el valor
    }
    cantidadControl?.updateValueAndValidity();
  }

  obtenerMaxCantidad(index: number): number {
    const materialId = this.materialesArray.at(index).get('id_material_almacen')?.value;
    const material = this.materialesDisponibles.find(m => m.id_material_almacen == materialId);
    return material ? material.cantidad : 999999; // Un valor grande si no hay material seleccionado
  }

  obtenerCantidadDisponible(index: number): number {
    const materialId = this.materialesArray.at(index).get('id_material_almacen')?.value;
    const material = this.materialesDisponibles.find(m => m.id_material_almacen == materialId);
    return material ? material.cantidad : 0;
  }

  // Método para calcular el porcentaje de progreso
  getPorcentajeProgreso(): number {
    switch (this.pasoActual) {
      case 1: return 33;
      case 2: return 66;
      case 3: return 100;
      default: return 33;
    }
  }

  // Método para volver a la página principal
  volver(): void {
    this.router.navigate(['/jefeobra/ver-actividades']);
  }

  // Envío del formulario
  onSubmit(): void {
    // Solo validamos el paso 1 (campos obligatorios)
    if (!this.esPaso1Valido()) {
      this.marcarCamposPaso1ComoTouched();
      this.mostrarModalError = true;
      this.mensajeError = 'Por favor, complete los campos obligatorios (Nombre, Descripción y Fecha)';
      return;
    }

    this.loading = true;
    
    // Preparar datos para enviar - Filtrar solo los que tienen valores
    const actividadData = {
      nombre_actividad: this.registroForm.value.nombre_actividad,
      descripcion: this.registroForm.value.descripcion,
      fecha_realizacion: this.registroForm.value.fecha_realizacion,
      // Empleados: solo los que tienen id_empleado
      empleados: this.empleadosArray.controls
        .filter(empleado => empleado.get('id_empleado')?.value)
        .map(empleado => ({ 
          id_empleado: empleado.get('id_empleado')?.value 
        })),
      // Materiales: solo los que tienen id_material_almacen Y cantidad válida
      materiales: this.materialesArray.controls
        .filter(material => material.get('id_material_almacen')?.value && 
                           material.get('cantidad')?.value && 
                           material.get('cantidad')?.valid)
        .map(material => ({
          id_material_almacen: material.get('id_material_almacen')?.value,
          cantidad: Number(material.get('cantidad')?.value)
        }))
    };

    // Simular envío a API (reemplazar con tu endpoint real)
    setTimeout(() => {
      console.log('Datos de actividad a enviar:', actividadData);
      
      // Aquí iría la llamada real a la API:
      /*
      this.http.post('http://tu-api/registrar-actividad', actividadData)
        .subscribe({
          next: (response) => {
            console.log('Actividad registrada:', response);
            this.loading = false;
            this.mostrarModalExito = true;
          },
          error: (error) => {
            console.error('Error al registrar actividad:', error);
            this.loading = false;
            this.mostrarModalError = true;
            this.mensajeError = 'Error al registrar la actividad. Por favor, intente nuevamente.';
          }
        });
      */
      
      // Simulación exitosa
      this.loading = false;
      this.mostrarModalExito = true;
      
    }, 1500);
  }

  // Métodos auxiliares
  private marcarCamposPaso1ComoTouched(): void {
    this.nombre_actividad?.markAsTouched();
    this.descripcion?.markAsTouched();
    this.fecha_realizacion?.markAsTouched();
  }

  // Métodos para modales
  cerrarModalExito(): void {
    this.mostrarModalExito = false;
    this.registroForm.reset();
    this.pasoActual = 1;
    // Limpiar los arrays
    while (this.empleadosArray.length !== 0) {
      this.empleadosArray.removeAt(0);
    }
    while (this.materialesArray.length !== 0) {
      this.materialesArray.removeAt(0);
    }
    this.volver(); // Regresa a la lista después de éxito
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
  }
}