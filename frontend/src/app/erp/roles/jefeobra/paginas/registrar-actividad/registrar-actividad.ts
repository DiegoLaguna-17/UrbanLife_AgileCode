import { Component, inject,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
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
  proyecto:any= this.router.getCurrentNavigation()?.extras?.state?.['proyecto'];
  
  // Datos para los selects
  empleadosDisponibles: any[] = [
  
  ];
  
  materialesDisponibles: any[] = [
   
  ];

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      // Paso 1: Datos básicos (OBLIGATORIOS)
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      fecha: ['', [Validators.required, this.fechaFuturaValidator]],
      
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
  get nombre() { return this.registroForm.get('nombre'); }
  get descripcion() { return this.registroForm.get('descripcion'); }
  get fecha() { return this.registroForm.get('fecha'); }


  ngOnInit(){
    this.cargarEmpleados();
    this.cargarMateriales();
  }

 
  cargarEmpleados(){
    const url="http://127.0.0.1:8000/api/sacar_empleados"
    this.http.get<any[]>(url).subscribe({
      next:(response)=>{
        this.empleadosDisponibles=response;
      },
      error:(err)=>{
        console.log("error al cargar empleados")
      }
    })
  }

  cargarMateriales(){
    const url="http://127.0.0.1:8000/api/sacar_materiales"
    this.http.get<any[]>(url).subscribe({
      next:(response)=>{
        this.materialesDisponibles=response;
      },
      error:(err)=>{
        console.log("error al cargar empleados")
      }
    })
  }

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
    return !!this.nombre?.valid && 
          !!this.descripcion?.valid && 
          !!this.fecha?.valid;
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


// ...

onSubmit(): void {
  if (!this.esPaso1Valido()) {
    this.marcarCamposPaso1ComoTouched();
    this.mostrarModalError = true;
    this.mensajeError = 'Por favor, complete los campos obligatorios';
    return;
  }

  this.loading = true;

  const actividadData = {
    nombre: this.registroForm.value.nombre,
    descripcion: this.registroForm.value.descripcion,
    fecha: this.registroForm.value.fecha,
    estado: "pendiente",
    proyecto_id_proyecto: this.proyecto.id_proyecto,
    empleados: this.empleadosArray.controls
      .filter(e => e.get('id_empleado')?.value)
      .map(e => ({ id_empleado: e.get('id_empleado')?.value }))
  };

  const materiales = this.materialesArray.controls
    .filter(m => m.get('id_material_almacen')?.value && m.get('cantidad')?.valid)
    .map(m => ({
      id_material_almacen: m.get('id_material_almacen')?.value,
      cantidad: Number(m.get('cantidad')?.value)
    }));

  const urlAct = "http://127.0.0.1:8000/api/registrar_actividad";
  const urlMat = "http://127.0.0.1:8000/api/registrar_material_proyecto";

  // Crear array de peticiones
  const requests = [];

  // 1️⃣ Actividad
  requests.push(this.http.post(urlAct, actividadData));

  // 2️⃣ Materiales (si existen)
  if (materiales.length > 0) {
    materiales.forEach(m => {
      const payload = {
        id_material_almacen: m.id_material_almacen,
        id_proyecto: this.proyecto.id_proyecto,
        fecha_entrega: actividadData.fecha,
        cantidad: m.cantidad
      };
      requests.push(this.http.post(urlMat, payload));
    });
  }

  // Ejecutar TODO al mismo tiempo
  forkJoin(requests).subscribe({
    next: (responses) => {
      console.log("Todo registrado exitosamente:", responses);

      this.loading = false;
      this.mostrarModalExito = true;
    },
    error: (err) => {
      console.error("Error en alguna petición:", err);

      this.loading = false;
      this.mostrarModalError = true;
      this.mensajeError = 'Error al registrar la actividad o materiales.';
    }
  });
}


  // Métodos auxiliares
  private marcarCamposPaso1ComoTouched(): void {
    this.nombre?.markAsTouched();
    this.descripcion?.markAsTouched();
    this.fecha?.markAsTouched();
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