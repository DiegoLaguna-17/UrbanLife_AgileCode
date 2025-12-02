import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient,HttpClientModule } from '@angular/common/http';
interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  correo: string;
  contrasena: string;
  activo: boolean;
  empleadoId?: number;
}

@Component({
  selector: 'app-ver-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './ver-usuario.html',
  styleUrls: ['./ver-usuario.scss']
})
export class VerUsuario implements OnInit {
  usuarioForm: FormGroup;

  modoEdicion: boolean = false;
  mostrarContrasena: boolean = false;
  mostrarModalExito: boolean = false;
  mostrarModalConfirmacion: boolean = false;

  usuarioData: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http:HttpClient
  ) {
    this.usuarioForm = this.fb.group({
      nombre: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]], // Siempre disabled
      rol: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Solo deshabilitamos los campos editables, el nombre ya viene disabled
    this.usuarioForm.get('rol')?.disable();
    this.usuarioForm.get('correo')?.disable();
    this.usuarioForm.get('contrasena')?.disable();
    this.obtenerDatosUsuario();
      
  }
  obtenerDatosUsuario(): void {
  const state = history.state;

  if (state && state.usuario) {
    this.usuarioData = state.usuario;
    console.log('✅ Usuario recibido desde state:', this.usuarioData);
    this.cargarDatosUsuario();
  } else {
    console.log('⚠️ No se encontró usuario en el state');
  }
}

/*
  obtenerDatosUsuario(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['usuario']) {
      this.usuarioData = navigation.extras.state['usuario'];
      console.log('Datos obtenidos del state:', this.usuarioData);
      this.cargarDatosUsuario();
      console.log(this.usuarioData)
      return;
    }

    const usuarioId = this.route.snapshot.paramMap.get('id');
    console.log('ID del usuario desde ruta:', usuarioId);
    console.log(this.usuarioData)

    if (usuarioId) {
      this.buscarUsuarioPorId(parseInt(usuarioId));
    } else {
      console.error('No se encontró ID de usuario');
      this.router.navigate(['/rrhh/administrar-usuarios']);
    }
      
  }

  buscarUsuarioPorId(id: number): void {
    const usuariosEjemplo: Usuario[] = [
      {
        id: 1,
        nombre: 'Juan Pérez',
        rol: 'Administrador',
        correo: 'juan.perez@urbanlife.com',
        contrasena: 'password123',
        activo: true,
        empleadoId: 1
      },
      {
        id: 2,
        nombre: 'María García',
        rol: 'Contador',
        correo: 'maria.garcia@urbanlife.com',
        contrasena: 'password456',
        activo: true,
        empleadoId: 2
      },
      {
        id: 3,
        nombre: 'Carlos López',
        rol: 'Jefe de Obra',
        correo: 'carlos.lopez@urbanlife.com',
        contrasena: 'password789',
        activo: true,
        empleadoId: 3
      },
      {
        id: 4,
        nombre: 'Ana Martínez',
        rol: 'Recursos Humanos',
        correo: 'ana.martinez@urbanlife.com',
        contrasena: 'password012',
        activo: false,
        empleadoId: 4
      }
    ];

    this.usuarioData = usuariosEjemplo.find(user => user.id === id) || null;
    
    if (this.usuarioData) {
      this.cargarDatosUsuario();
    } else {
      console.error('Usuario no encontrado con ID:', id);
      this.router.navigate(['/rrhh/administrar-usuarios']);
    }
  }
*/
  cargarDatosUsuario(): void {
    if (this.usuarioData) {
      console.log('Cargando datos del usuario:', this.usuarioData);
      this.usuarioForm.patchValue({
        nombre: this.usuarioData.nombre,
        rol: this.usuarioData.rol,
        correo: this.usuarioData.correo,
        contrasena: this.usuarioData.contrasena
      });
    } else {
      console.error('No hay datos de usuario para cargar');
    }
  }

  onToggleEdicion(): void {
  if (this.modoEdicion) {

    // Solo ejecutar si el usuario realmente modificó algo
    if (this.usuarioForm.dirty) {
       // 👈 SOLO si hubo cambios
  

      let id_rol=0;
        if(this.usuarioForm.get('rol')?.value=="Administrador"){
          id_rol=3;
        }else if(this.usuarioForm.get('rol')?.value=="Recursos Humanos"){
          id_rol=5
        }else if(this.usuarioForm.get('rol')?.value=="Jefe de Obra"){
          id_rol=6;
        }else{
          id_rol=4;
        }
        const body={
          correo:this.usuarioData?.correo,
          rol_id_rol:id_rol,
        }
        console.log('Usuario actualizado:', body);
         const url='http://127.0.0.1:8000/api/update_usuario/'+this.usuarioData?.id;
      this.http.put(url,body).subscribe({
        next:(response)=>{
          this.mostrarModalExito = true;
        },
        error:(err)=>{
          alert('Error al actualizar usuario '+err)
        }
      })

      

      this.usuarioForm.get('rol')?.disable();
      this.usuarioForm.get('correo')?.disable();
      this.usuarioForm.get('contrasena')?.disable();

      this.usuarioData = {
        ...this.usuarioData,
        ...this.usuarioForm.value
      };
      this.onGuardarCambios();
      // Importante: resetear dirty para evitar falsos positivos
      this.usuarioForm.markAsPristine();
    }else{
   
      this.usuarioForm.get('rol')?.disable();
      this.usuarioForm.get('correo')?.disable();
      this.usuarioForm.get('contrasena')?.disable();

    }
       this.modoEdicion = false;
    

  } else {
    // Activar edición
    this.modoEdicion = true;

    this.usuarioForm.get('rol')?.enable();
    this.usuarioForm.get('correo')?.enable();
    this.usuarioForm.get('contrasena')?.enable();
  }
}

  onGuardarCambios(): void {
    

}

  onEliminar(): void {
    this.mostrarModalConfirmacion = true;
  }

  confirmarAccion(): void {
    if (this.usuarioData) {
      // Cambiar estado activo/inactivo
      this.usuarioData.activo = !this.usuarioData.activo;
      console.log('Usuario actualizado:', this.usuarioData.activo ? 'Activado' : 'Desactivado', this.usuarioData);
         const url='http://127.0.0.1:8000/api/eliminar_empleado/'+this.usuarioData?.empleadoId;
         this.http.put(url,{}).subscribe({
          next:(response)=>{
            alert('Usuario desactivado')
          },
          error:(err)=>{
            alert('error al desactivar usuario')
          }
         })
    }
    
    this.mostrarModalConfirmacion = false;
    
    // Recargar los datos para reflejar el cambio
    /*
    if (this.usuarioData) {
      this.buscarUsuarioPorId(this.usuarioData.id);
    }
      */
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  onSubmit(): void {
    console.log('Formulario enviado');
  }

  // Getters para el formulario
  get nombre() { return this.usuarioForm.get('nombre'); }
  get rol() { return this.usuarioForm.get('rol'); }
  get correo() { return this.usuarioForm.get('correo'); }
  get contrasena() { return this.usuarioForm.get('contrasena'); }
}