import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Empleado {
  id: number;
  nombre: string;
  puesto: string;
  departamento?: string;
  fechaIngreso?: string;
  estado?: string;
  contrato?: string;
}

@Component({
  selector: 'app-ver-empleado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './ver-empleado.html',
  styleUrls: ['./ver-empleado.scss']
})
export class VerEmpleado implements OnInit {
  registroForm: FormGroup;
  usuarioForm: FormGroup;
  datosOriginales:any
  modoEdicion: boolean = false;
  mostrarFormularioUsuario: boolean = false;
  mostrarModalExito: boolean = false;
  mostrarModalEliminar: boolean = false;

  contratoArchivo: File | null = null;
  empleadoData: Empleado | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient   ,
     private cd: ChangeDetectorRef   
  ) {
    // Formulario principal - SIN disabled inicial
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      puesto: ['', [Validators.required, Validators.minLength(3)]],
      contrato: ['']
    });

    this.usuarioForm = this.fb.group({
      rol_id_rol: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Inicialmente deshabilitamos el formulario
    this.registroForm.disable();
    this.obtenerDatosEmpleado();
  }

  obtenerDatosEmpleado(): void {
    // PRIMERO: Intentar obtener datos del state
    const state = history.state;

  if (state && state.empleado) {
    this.empleadoData = state.empleado;
    console.log('✅ Usuario recibido desde state:', this.empleadoData);
    this.cargarDatosEmpleado();
  } else {
    console.log('⚠️ No se encontró usuario en el state');
  }  
  }

  

  cargarDatosEmpleado(): void {
    if (this.empleadoData) {
      console.log('Cargando datos del empleado:', this.empleadoData);
      this.registroForm.patchValue({
  nombre: this.empleadoData.nombre,
  puesto: this.empleadoData.puesto,
  contrato: this.empleadoData.contrato || ''
});

// Guardar datos originales para detectar cambios
this.datosOriginales = this.registroForm.getRawValue();

    } else {
      console.error('No hay datos de empleado para cargar');
    }
  }

  onToggleEdicion(): void {
  if (!this.modoEdicion) {
    // ACTIVAR EDICIÓN
    this.modoEdicion = true;
    this.registroForm.enable();
    return;
  }

  // --- SI YA ESTÁ EN MODO EDICIÓN ----

  const valoresActuales = this.registroForm.getRawValue();

  // 1️⃣ Verificar si hubo cambios reales
  const sinCambios =
    JSON.stringify(valoresActuales) === JSON.stringify(this.datosOriginales);

  if (sinCambios) {
    console.log("⚠️ No hubo cambios, no se enviará al backend.");
    this.modoEdicion = false;
    this.registroForm.disable();
    return;
  }

  // 2️⃣ Verificar que el formulario sea válido
  if (!this.registroForm.valid || !this.empleadoData) {
    alert("Complete los campos correctamente.");
    return;
  }

  // 3️⃣ ENVIAR AL BACKEND SOLO SI CAMBIÓ ALGO
  const data = {
    nombre: valoresActuales.nombre,
    puesto: valoresActuales.puesto,
    contrato: valoresActuales.contrato
  };

  const url = `http://127.0.0.1:8000/api/update_empleado/${this.empleadoData.id}`;

  this.http.put(url, data).subscribe({
    next: (resp) => {
       console.log("✔️ Empleado actualizado:", resp);

  this.mostrarModalExito = true;

  // Forzar renderizado del modal
  this.cd.detectChanges();

  this.datosOriginales = valoresActuales;

  this.modoEdicion = false;
  this.registroForm.disable();
    },
    error: (err) => {
      console.error("❌ Error al actualizar empleado", err);
      alert("Error al actualizar el empleado");
    }
  });
}


  onDarUsuario(): void {
    this.mostrarFormularioUsuario = true;
  }

  onRegistrarUsuario(): void {
    if (this.usuarioForm.valid && this.empleadoData) {
      const usuarioData = {
        ...this.usuarioForm.value,
        empleado_id_empleado: this.empleadoData.id,
      };
      console.log(usuarioData)
      const url=`http://127.0.0.1:8000/api/asignar_usuario`;
      this.http.post(url,usuarioData).subscribe({
          next:(respuesta)=>{
            alert("Usuario creado correctamente para "+this.empleadoData?.nombre)
          },error:(err)=>{
            alert("Error al asignar usuario a " + this.empleadoData?.nombre)
          }
      });
      
    }
  }

  onEliminar(): void {
    this.mostrarModalEliminar = true;
  }

  confirmarEliminar(): void {
     if (!this.empleadoData) return;

  const url = `http://127.0.0.1:8000/api/eliminar_empleado/${this.empleadoData.id}`;

  this.http.put(url, {})  // No requiere body
    .subscribe({
      next: (resp) => {
        console.log('✔️ Empleado desactivado:', resp);

        this.mostrarModalEliminar = false;

        // Redirigir al listado
        this.router.navigate(['/rrhh/administrar-empleados']);
      },
      error: (err) => {
        console.error('❌ Error al desactivar empleado:', err);
        alert('Error al desactivar el empleado');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        this.contratoArchivo = file;
        this.registroForm.patchValue({ contrato: file.name });
      } else {
        alert('Por favor, seleccione un archivo PDF');
      }
    }
  }

  onSubmit(): void {
    console.log('Formulario enviado');
  }

  // Getters para formulario principal
  get nombre() { return this.registroForm.get('nombre'); }
  get puesto() { return this.registroForm.get('puesto'); }
  get contrato() { return this.registroForm.get('contrato'); }

  // Getters para formulario de usuario
  get rol_id_ril() { return this.usuarioForm.get('rol_id_rol'); }
  get correo() { return this.usuarioForm.get('correo'); }
  get contrasenia() { return this.usuarioForm.get('contrasenia'); }
}