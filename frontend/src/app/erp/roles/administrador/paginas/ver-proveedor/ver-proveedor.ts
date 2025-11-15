import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Proveedor } from '../../componentes/card-proveedor/card-proveedor';

@Component({
  selector: 'app-ver-proveedor',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './ver-proveedor.html',
  styleUrl: './ver-proveedor.scss'
})
export class VerProveedor implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  proveedor: Proveedor | null = null;
  proveedorForm!: FormGroup;
  modoEdicion: boolean = false;
  formularioModificado: boolean = false;
  mostrarModal: boolean = false;
  datosOriginales: any = null;
  loading: boolean = false;
  error: string = '';
  pasoActual: number = 1;

  constructor() {
    // Obtener los datos del proveedor del estado de la navegación
    const navigation = this.router.getCurrentNavigation();
    this.proveedor = navigation?.extras?.state?.['proveedor'] || null;
    
    if (!this.proveedor) {
      console.error('No se recibió información del proveedor');
    }
  }

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    if (this.proveedor) {
      this.proveedorForm = this.fb.group({
        // Datos del Proveedor
        nombre: [
          { value: this.proveedor.nombre, disabled: true }, 
          [Validators.required, Validators.minLength(3)]
        ],
        visibilidad: [
          { value: this.proveedor.visibilidad.toString(), disabled: true }, 
          Validators.required
        ],
        web: [
          { value: this.proveedor.web, disabled: true }, 
          [Validators.pattern('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$')]
        ],
        
        // Datos de Contacto
        contacto: [
          { value: this.proveedor.contacto, disabled: true }, 
          [Validators.required, Validators.minLength(3)]
        ],
        telefono: [
          { value: this.proveedor.telefono, disabled: true }
        ],
        correo: [
          { value: this.proveedor.correo, disabled: true }, 
          [Validators.required, Validators.email]
        ],
        direccion: [
          { value: this.proveedor.direccion, disabled: true }, 
          [Validators.required, Validators.minLength(10)]
        ]
      });

      // Guardar datos originales para comparar
      this.datosOriginales = this.proveedorForm.value;

      // Escuchar cambios en el formulario
      this.proveedorForm.valueChanges.subscribe(() => {
        this.verificarCambios();
      });
    }
  }

  // Navegación entre pasos
  siguientePaso(): void {
    // Siempre permite ir al siguiente paso, sin validar si está en modo edición
    this.pasoActual = 2;
  }

  anteriorPaso(): void {
    // Siempre permite volver al paso anterior
    this.pasoActual = 1;
  }

  // Verificar si el formulario ha sido modificado
  verificarCambios() {
    if (this.datosOriginales) {
      // Obtener valores actuales habilitando temporalmente los controles
      const valoresActuales = this.proveedorForm.getRawValue();
      this.formularioModificado = JSON.stringify(valoresActuales) !== JSON.stringify(this.datosOriginales);
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
    
    // Habilitar todos los controles para edición
    Object.keys(this.proveedorForm.controls).forEach(key => {
      this.proveedorForm.get(key)?.enable();
    });
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.formularioModificado = false;
    
    // Restaurar datos originales
    this.proveedorForm.patchValue(this.datosOriginales);
    
    // Deshabilitar todos los controles
    Object.keys(this.proveedorForm.controls).forEach(key => {
      this.proveedorForm.get(key)?.disable();
    });
    
    // Volver al paso 1 al cancelar
    this.pasoActual = 1;
  }

  guardarCambios() {
    if (this.proveedorForm.valid) {
      // Obtener los valores actuales (con controles habilitados)
      const valoresActuales = this.proveedorForm.getRawValue();
      
      console.log('Datos a actualizar:', valoresActuales);
      
      this.modoEdicion = false;
      this.formularioModificado = false;
      
      // Actualizar datos originales con los nuevos valores
      this.datosOriginales = valoresActuales;
      
      // Actualizar también el objeto proveedor
      if (this.proveedor) {
        this.proveedor = {
          ...this.proveedor,
          ...valoresActuales,
          visibilidad: valoresActuales.visibilidad === 'true'
        };
      }
      
      // Deshabilitar controles después de guardar
      Object.keys(this.proveedorForm.controls).forEach(key => {
        this.proveedorForm.get(key)?.disable();
      });
      
      this.actualizarProveedor();
      // Volver al paso 1 después de guardar
      this.pasoActual = 1;
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.proveedorForm.controls).forEach(key => {
        this.proveedorForm.get(key)?.markAsTouched();
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

  // Funciones para los botones de material (sin acción por el momento)
  anadirMaterial() {
    console.log('Función añadir material - pendiente de implementar');
  }

  verMaterial() {
    console.log('Función ver material - pendiente de implementar');
  }

  // Cerrar modal
  cerrarModal() {
    this.mostrarModal = false;
  }

  volver() {
    this.router.navigate(['/administrador/administrar-proveedores']);
  }

  // Actualizar proveedor en el backend
  actualizarProveedor() {
    this.loading = true;
    this.error = '';

    const datosActualizados = this.proveedorForm.getRawValue();
    datosActualizados.visibilidad = datosActualizados.visibilidad === 'true';

    // Simulación de actualización (reemplaza con tu endpoint real)
    setTimeout(() => {
      try {
        console.log('📋 Datos actualizados del proveedor:');
        console.log('Nombre:', datosActualizados.nombre);
        console.log('Visibilidad:', datosActualizados.visibilidad);
        console.log('Web:', datosActualizados.web);
        console.log('Contacto:', datosActualizados.contacto);
        console.log('Teléfono:', datosActualizados.telefono);
        console.log('Correo:', datosActualizados.correo);
        console.log('Dirección:', datosActualizados.direccion);
        
        this.loading = false;
        this.mostrarModal = true;
        
      } catch (err) {
        this.loading = false;
        this.error = 'Error al actualizar el proveedor';
        console.error('Error:', err);
      }
    }, 1000);

    // ⚠️ CÓDIGO PARA CUANDO TENGAS EL ENDPOINT REAL (descomenta cuando lo necesites)
    /*
    this.http.put(`http://127.0.0.1:8000/api/update_proveedor/${this.proveedor?.id_proveedor}`, datosActualizados)
      .subscribe({
        next: (respuesta) => {
          console.log("Actualizado correctamente:", respuesta);
          this.loading = false;
          this.mostrarModal = true;
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 422) {
            this.error = "Datos inválidos";
            console.log("Errores 422:", err.error);
            alert("Error de validación: " + JSON.stringify(err.error));
          } else if (err.status === 404) {
            this.error = "Proveedor no encontrado";
            alert("Proveedor no encontrado");
          } else {
            this.error = "Error al actualizar proveedor";
            console.log(err);
            alert("Ocurrió un error al actualizar el proveedor");
          }
        }
      });
    */
  }

  // Getters para fácil acceso a los controles del formulario
  get nombre() { return this.proveedorForm.get('nombre'); }
  get visibilidad() { return this.proveedorForm.get('visibilidad'); }
  get web() { return this.proveedorForm.get('web'); }
  get contacto() { return this.proveedorForm.get('contacto'); }
  get telefono() { return this.proveedorForm.get('telefono'); }
  get correo() { return this.proveedorForm.get('correo'); }
  get direccion() { return this.proveedorForm.get('direccion'); }
}