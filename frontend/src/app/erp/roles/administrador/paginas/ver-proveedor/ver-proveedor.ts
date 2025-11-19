import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
  nuevaImagen: string | null = null;
  archivoSeleccionado: File | null = null;
  @ViewChild('fileInput') fileInput!: any;

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
    console.log(this.proveedor)
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
  //Para el manejo de las imágene
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      this.archivoSeleccionado = file;
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.nuevaImagen = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarImagen() {
    this.proveedor!.logo = '';
    this.nuevaImagen = null;
    this.archivoSeleccionado = null;
    this.verificarCambios(); // Para detectar que el formulario fue modificado
  }

  cancelarNuevaImagen() {
    this.nuevaImagen = null;
    this.archivoSeleccionado = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
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

      const valoresActuales = this.proveedorForm.getRawValue();
      const cambiosFormulario = JSON.stringify(valoresActuales) !== JSON.stringify(this.datosOriginales);
      const cambiosImagen = this.nuevaImagen !== null || this.proveedor?.logo !== this.datosOriginales.logo;
      
      this.formularioModificado = cambiosFormulario || cambiosImagen;
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
    
    // Restaurar datos originales del formulario
    this.proveedorForm.patchValue(this.datosOriginales);
    
    // Restaurar imagen original
    this.nuevaImagen = null;
    this.archivoSeleccionado = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    
    // Deshabilitar controles
    Object.keys(this.proveedorForm.controls).forEach(key => {
      this.proveedorForm.get(key)?.disable();
    });
    

    this.pasoActual = 1;
  }

  guardarCambios() {
    if (this.proveedorForm.valid) {

      const valoresActuales = this.proveedorForm.getRawValue();
      
      console.log('Datos a actualizar:', valoresActuales);

      
      this.modoEdicion = false;
      this.formularioModificado = false;
      
      // Actualizar datos originales
      this.datosOriginales = valoresActuales;
      
      // Actualizar el objeto proveedor
      if (this.proveedor) {
        this.proveedor = {
          ...this.proveedor,
          ...valoresActuales,
          visibilidad: valoresActuales.visibilidad === 'true'
        };
      }
      
      // Deshabilitar controles
      Object.keys(this.proveedorForm.controls).forEach(key => {
        this.proveedorForm.get(key)?.disable();
      });
      
      // Llamar a actualizar proveedor (que ahora manejará la imagen)
      this.actualizarProveedor();

      this.pasoActual = 1;
    } else {

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
    console.log("ENVIANDO AL BACKEND:", {
  id_proveedor: this.proveedor?.id_proveedor,
  material: material.material,
  descripcion: material.descripcion
});
  if (!material.material || !material.descripcion) {
    alert("Debe llenar material y descripción");
    return;
  }

  // Si es un material existente → EDITAR
  if (material.id_material_proveedor && material.id_material_proveedor !== 0) {
    
    this.http.put<MaterialProveedor>(`http://127.0.0.1:8000/api/update_material_proveedor/${material.id_material_proveedor}`, {
  material: material.material,
  descripcion: material.descripcion
})
.subscribe({
  next: (respuesta: MaterialProveedor) => {
    console.log("✔ Material actualizado:", respuesta);

    const index = this.materiales.findIndex(m => m.id_material_proveedor === material.id_material_proveedor);
    if (index !== -1) {
      this.materiales[index] = respuesta; // ← ya no da error
    }

    this.cambiarVista('verMaterial');
  },
  error: (err) => {
    console.error("❌ Error al actualizar material:", err);
    alert("Error al actualizar material");
  }
});


    return;
  }

  // Si es un material nuevo → REGISTRAR
  this.http.post<MaterialProveedor>(
  "http://127.0.0.1:8000/api/registrar_material_proveedor",
  {
    proveedor_id_proveedor: this.proveedor?.id_proveedor,   // ← OBLIGATORIO
    material: material.material,
    descripcion: material.descripcion
  }
)
.subscribe({
  next: (respuesta) => {
    console.log("✔ Registrado correctamente:", respuesta);
    this.materiales.push(respuesta);
    this.cambiarVista('verMaterial');
  },
  error: (err) => {
    console.error("❌ Error al registrar material:", err);
    alert("Error en el registro: " + JSON.stringify(err.error));
  }
});


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
  if (!this.proveedor?.id_proveedor) {
    console.warn("No hay proveedor seleccionado");
    return;
  }

  this.http.get<any[]>("http://127.0.0.1:8000/api/get_material_proveedores")
  .subscribe({
    next: (lista) => {
      console.log("Materiales obtenidos del backend:", lista);

      // MAPEO → convertir las claves del backend a tu interfaz
      const mapeados: MaterialProveedor[] = lista.map(m => ({
        id_material_proveedor: m.id_material,         // backend → interfaz
        id_proveedor: m.proveedor_id_proveedor,       // backend → interfaz
        material: m.material,
        descripcion: m.descripcion
      }));

      // FILTRAR por proveedor actual
      this.materiales = mapeados.filter(m =>
        m.id_proveedor === this.proveedor?.id_proveedor
      );

      console.log("Materiales filtrados y mapeados:", this.materiales);
    },
    error: (err) => {
      console.error("❌ Error al cargar materiales:", err);
      this.materiales = [];
    }
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

    // Si hay una nueva imagen, usar FormData
    if (this.archivoSeleccionado) {
      const formData = new FormData();
      
      // Añadir todos los campos del formulario
      Object.keys(datosActualizados).forEach(key => {
        formData.append(key, datosActualizados[key]);
      });
      
      // Añadir la imagen
      formData.append('logo', this.archivoSeleccionado);
      
      const url = `http://127.0.0.1:8000/api/update_proveedor/${this.proveedor?.id_proveedor}`;
      
      this.http.put(url, formData).subscribe({
        next: (resp: any) => {
          console.log('Proveedor actualizado con nueva imagen:', resp);
          this.loading = false;
          this.mostrarModal = true;
          
          // Actualizar la imagen en el objeto proveedor si viene en la respuesta
          if (resp.logo) {
            this.proveedor!.logo = resp.logo;
          }
          
          // Limpiar la nueva imagen
          this.nuevaImagen = null;
          this.archivoSeleccionado = null;
        },
        error: (err) => {
          console.error('Error al actualizar proveedor con imagen:', err);
          this.loading = false;
          alert("Error al actualizar proveedor");
        }
      });
    } else {
      // Sin nueva imagen, enviar normalmente
      const url = `http://127.0.0.1:8000/api/update_proveedor/${this.proveedor?.id_proveedor}`;
      this.http.put(url, datosActualizados).subscribe({
        next: (resp) => {
          this.loading = false;
          this.mostrarModal = true;
        },
        error: (err) => {
          this.loading = false;
          alert("Error al actualizar proveedor");
        }
      });
    }
    // Simulación de actualización
    /* 
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