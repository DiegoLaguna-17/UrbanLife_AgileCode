import { Component, OnInit } from '@angular/core';
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
    private http: HttpClient   
  ) {
    // Formulario principal - SIN disabled inicial
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      puesto: ['', [Validators.required, Validators.minLength(3)]],
      contrato: ['']
    });

    this.usuarioForm = this.fb.group({
      rol: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
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
    } else {
      console.error('No hay datos de empleado para cargar');
    }
  }

  onToggleEdicion(): void {
    if (this.modoEdicion) {
      // Guardar cambios
      if (this.registroForm.valid && this.empleadoData) {
        this.mostrarModalExito = true;
        this.modoEdicion = false;
        this.registroForm.disable(); // Deshabilitamos después de guardar
        
        // Actualizar datos locales
        this.empleadoData = {
          ...this.empleadoData,
          ...this.registroForm.value
        };
        
          const data={
            nombre:this.empleadoData?.nombre,
            puesto:this.empleadoData?.puesto,
            contrato:this.empleadoData?.contrato
          }

           const url = `http://127.0.0.1:8000/api/update_empleado/${this.empleadoData?.id}`;

      this.http.put(url, data).subscribe({
        next: (resp) => {

          this.mostrarModalExito = true;
          this.modoEdicion = false;
          this.registroForm.disable();

          
        },
        error: (err) => {
          console.error("❌ Error al actualizar empleado", err);
          alert("Error al actualizar el empleado");
        }
      });


      }
    } else {
      // Activar edición
      this.modoEdicion = true;
      this.registroForm.enable(); // Habilitamos para editar
    }
  }

  onDarUsuario(): void {
    this.mostrarFormularioUsuario = true;
  }

  onRegistrarUsuario(): void {
    if (this.usuarioForm.valid && this.empleadoData) {
      const usuarioData = {
        ...this.usuarioForm.value,
        empleadoId: this.empleadoData.id,
        empleadoNombre: this.empleadoData.nombre
      };
      
      console.log('Usuario creado:', usuarioData);
      alert('Usuario creado exitosamente!');
      this.mostrarFormularioUsuario = false;
      this.usuarioForm.reset();
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
  get rol() { return this.usuarioForm.get('rol'); }
  get correo() { return this.usuarioForm.get('correo'); }
  get contrasena() { return this.usuarioForm.get('contrasena'); }
}