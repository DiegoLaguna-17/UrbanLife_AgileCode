import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Proveedor, MaterialProveedor } from '../../componentes/card-proveedor/card-proveedor';
import { MaterialForm } from '../../componentes/material-form/material-form';
import { MaterialesListComponent } from '../../componentes/materiales-list/materiales-list';

@Component({
  selector: 'app-ver-proveedor',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    MaterialForm,
    MaterialesListComponent
  ],
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

  // Nuevas propiedades para el manejo de materiales
  vistaPanelIzquierdo: 'default' | 'añadirMaterial' | 'verMaterial' | 'editarMaterial' = 'default';
  materialSeleccionado?: MaterialProveedor;
  materiales: MaterialProveedor[] = [];

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
          [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
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
          [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
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
          [Validators.required, Validators.minLength(10), Validators.maxLength(200)]
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
    // Siempre permite ir al siguiente paso
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

  // ========== NUEVOS MÉTODOS PARA MANEJO DE MATERIALES ==========

  cambiarVista(vista: 'default' | 'añadirMaterial' | 'verMaterial' | 'editarMaterial') {
    this.vistaPanelIzquierdo = vista;
    if (vista === 'verMaterial') {
      this.cargarMateriales();
    }
  }

  anadirMaterial() {
    this.materialSeleccionado = undefined;
    this.cambiarVista('añadirMaterial');
  }

  verMaterial() {
    this.cambiarVista('verMaterial');
  }

  seleccionarMaterialParaEditar(material: MaterialProveedor) {
    this.materialSeleccionado = material;
    this.cambiarVista('editarMaterial');
  }

  guardarMaterial(material: MaterialProveedor) {
    // Aquí implementamos la lógica para guardar el material
    console.log('Guardar material:', material);
    
    // Simulación de guardado
    if (material.id_material_proveedor === 0) {
      // Nuevo material
      material.id_material_proveedor = this.generarNuevoId();
      this.materiales.push(material);
      console.log('Nuevo material añadido:', material);
    } else {
      // Editar material existente
      const index = this.materiales.findIndex(m => m.id_material_proveedor === material.id_material_proveedor);
      if (index !== -1) {
        this.materiales[index] = material;
        console.log('Material actualizado:', material);
      }
    }
    
    // Volver a la vista de lista de materiales después de guardar
    this.cambiarVista('verMaterial');
  }

  private generarNuevoId(): number {
    // Generar un ID único basado en el máximo ID existente
    const maxId = this.materiales.reduce((max, material) => 
      Math.max(max, material.id_material_proveedor), 0);
    return maxId + 1;
  }

  cancelarAccionMaterial() {
    this.cambiarVista('default');
  }

  async cargarMateriales() {
    try {
      this.materiales = await this.simularCargaMateriales();
      console.log('Materiales cargados para el proveedor:', this.proveedor?.id_proveedor, this.materiales);
    } catch (error) {
      console.error('Error al cargar materiales:', error);
      this.materiales = [];
    }
  }

  private simularCargaMateriales(): Promise<MaterialProveedor[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // DATOS DE PRUEBA
        const todosLosMateriales: MaterialProveedor[] = [
          {
            id_material_proveedor: 1,
            id_proveedor: 1,
            material: 'Cemento',
            descripcion: 'Cemento de alta resistencia'
          },
          {
            id_material_proveedor: 2,
            id_proveedor: 1, 
            material: 'Arena',
            descripcion: 'Arena fina para construcción'
          },
          {
            id_material_proveedor: 3,
            id_proveedor: 2, 
            material: 'Grava',
            descripcion: 'Grava de 3/4 para concreto'
          },
          {
            id_material_proveedor: 4,
            id_proveedor: 1, 
            material: 'Ladrillos',
            descripcion: 'Ladrillos de arcilla roja'
          },
          {
            id_material_proveedor: 5,
            id_proveedor: 3,
            material: 'Pintura',
            descripcion: 'Pintura latex blanca'
          }
        ];

        // Filtrar materiales que pertenecen al proveedor actual
        const idProveedorActual = this.proveedor?.id_proveedor;
        const materialesFiltrados = todosLosMateriales.filter(material => 
          material.id_proveedor === idProveedorActual
        );
        
        resolve(materialesFiltrados);
      }, 500);
    });
  }

  volverDesdeMateriales() {
    this.cambiarVista('default');
  }

  // ========== FIN NUEVOS MÉTODOS ==========

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

    // Simulación de actualización 
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

    // CÓDIGO PAR EL ENDPOINT 
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