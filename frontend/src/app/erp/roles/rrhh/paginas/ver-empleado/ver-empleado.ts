import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
  imports: [CommonModule, ReactiveFormsModule],
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
    private route: ActivatedRoute
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
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['empleado']) {
      this.empleadoData = navigation.extras.state['empleado'];
      console.log('Datos obtenidos del state:', this.empleadoData);
      this.cargarDatosEmpleado();
      return;
    }

    // SEGUNDO: Si no hay state, obtener de la ruta
    const empleadoId = this.route.snapshot.paramMap.get('id');
    console.log('ID del empleado desde ruta:', empleadoId);

    if (empleadoId) {
      this.buscarEmpleadoPorId(parseInt(empleadoId));
    } else {
      console.error('No se encontró ID de empleado');
      this.router.navigate(['/rrhh/administrar-empleados']);
    }
  }

  buscarEmpleadoPorId(id: number): void {
    // Datos de ejemplo - en una app real esto vendría de un servicio
    const empleadosEjemplo: Empleado[] = [
      {
        id: 1,
        nombre: 'Juan Pérez',
        puesto: 'Albañil',
        departamento: 'Construcción',
        fechaIngreso: '2023-01-15',
        estado: 'Activo',
        contrato: 'contrato_albanyl_001.pdf'
      },
      {
        id: 2,
        nombre: 'María García',
        puesto: 'Albañil',
        departamento: 'Construcción',
        fechaIngreso: '2023-02-20',
        estado: 'Activo',
        contrato: 'contrato_albanyl_002.pdf'
      },
      {
        id: 3,
        nombre: 'Carlos López',
        puesto: 'Maestro de obra',
        departamento: 'Construcción',
        fechaIngreso: '2022-11-10',
        estado: 'Activo',
        contrato: 'contrato_maestro_001.pdf'
      },
      {
        id: 4,
        nombre: 'Ana Martínez',
        puesto: 'Escultor',
        departamento: 'Diseño',
        fechaIngreso: '2023-03-05',
        estado: 'Activo',
        contrato: 'contrato_escultor_001.pdf'
      }
    ];

    this.empleadoData = empleadosEjemplo.find(emp => emp.id === id) || null;
    
    if (this.empleadoData) {
      this.cargarDatosEmpleado();
    } else {
      console.error('Empleado no encontrado con ID:', id);
      this.router.navigate(['/rrhh/administrar-empleados']);
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
        
        console.log('Empleado actualizado:', this.empleadoData);
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
    if (this.empleadoData) {
      console.log('Empleado eliminado:', this.empleadoData.id);
      // Aquí llamarías a un servicio para eliminar el empleado
    }
    
    this.mostrarModalEliminar = false;
    this.router.navigate(['/rrhh/administrar-empleados']);
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