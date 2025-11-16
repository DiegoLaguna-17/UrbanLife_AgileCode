import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registrar-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registrar-proveedores.html',
  styleUrl: './registrar-proveedores.scss'
})
export class RegistrarProveedores {
  registroForm: FormGroup;
  private router = inject(Router);
  private http = inject(HttpClient);
  
  // Variables de control
  pasoActual: number = 1;
  logoArchivo: File | null = null;
  mostrarModalExito: boolean = false;
  mostrarModalError: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      // Paso 1: Datos del Proveedor
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      visibilidad: ['', Validators.required],
      web: ['', [Validators.pattern('https?://.+')]],
      logo: [''],
      
      // Paso 2: Datos de Contacto
      contacto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      telefono: [''],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      direccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]]
    });
  }

  // Método para volver a la página principal
  volver(): void {
    this.router.navigate(['/administrador/administrar-proveedores']);
  }

  // Manejar selección de archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea imagen
      if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
        this.logoArchivo = file;
        this.logo?.setValue(file.name);
      } else {
        alert('Por favor, seleccione una imagen PNG o JPG');
        this.logoArchivo = null;
        this.logo?.setValue('');
      }
    }
  }

  // Navegación entre pasos
  siguientePaso(): void {
    if (this.esPaso1Valido()) {
      this.pasoActual = 2;
    } else {
      this.marcarCamposPaso1ComoTouched();
    }
  }

  anteriorPaso(): void {
    this.pasoActual = 1;
  }

  // Validar paso 1
  esPaso1Valido(): boolean {
    const controlesPaso1 = ['nombre', 'visibilidad'];
    return controlesPaso1.every(control => this.registroForm.get(control)?.valid);
  }

  // Marcar campos del paso 1 como touched
  private marcarCamposPaso1ComoTouched(): void {
    const controlesPaso1 = ['nombre', 'visibilidad'];
    controlesPaso1.forEach(control => {
      this.registroForm.get(control)?.markAsTouched();
    });
  }

  // Envío del formulario
  onSubmit(): void {
    if (this.registroForm.valid) {
      const proveedorData = {
        ...this.registroForm.value,
        // Convertir visibilidad a booleano
        visibilidad: this.registroForm.value.visibilidad === 'true'
      };
      
      console.log('Datos del proveedor:', proveedorData);
      
      // Aquí puedes enviar los datos al servidor
      this.registrarProveedor(proveedorData);
      
    } else {
      this.marcarCamposComoTouched();
      this.mostrarModalError = true;
    }
  }

  // Registrar proveedor en el backend
  registrarProveedor(proveedorData: any): void {
    this.loading = true;
    this.error = '';
    
    // Simulación de envío (reemplaza con tu endpoint real)
    setTimeout(() => {
      try {
        console.log('Datos a enviar al backend:');
        console.log('Nombre:', proveedorData.nombre);
        console.log('Visibilidad:', proveedorData.visibilidad);
        console.log('Web:', proveedorData.web);
        console.log('Contacto:', proveedorData.contacto);
        console.log('Teléfono:', proveedorData.telefono);
        console.log('Correo:', proveedorData.correo);
        console.log('Dirección:', proveedorData.direccion);
        
        this.registroForm.reset();
        this.pasoActual = 1;
        this.logoArchivo = null;
        this.mostrarModalExito = true;
        this.loading = false;
        
      } catch (err) {
        this.loading = false;
        this.error = 'Error al registrar el proveedor';
        this.mostrarModalError = true;
      }
    }, 1000);

    // CÓDIGO PARA EL ENDPOINT 
    /*
    this.http.post("http://127.0.0.1:8000/api/registrar_proveedor", proveedorData)
      .subscribe({
        next: (respuesta) => {
          console.log("Registrado correctamente:", respuesta);
          this.loading = false;
          this.registroForm.reset();
          this.pasoActual = 1;
          this.logoArchivo = null;
          this.mostrarModalExito = true;
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 422) {
            this.error = "Datos inválidos";
            console.log("Errores 422:", err.error);
          } else {
            this.error = "Error al registrar proveedor";
            console.log(err);
          }
          this.mostrarModalError = true;
        }
      });
    */
  }

  // Métodos para modales
  cerrarModalExito(): void {
    this.mostrarModalExito = false;
    this.volver(); // Regresa a la lista después de éxito
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
  }

  private marcarCamposComoTouched(): void {
    Object.keys(this.registroForm.controls).forEach(key => {
      this.registroForm.get(key)?.markAsTouched();
    });
  }

  // Getters para fácil acceso
  get nombre() { return this.registroForm.get('nombre'); }
  get visibilidad() { return this.registroForm.get('visibilidad'); }
  get web() { return this.registroForm.get('web'); }
  get logo() { return this.registroForm.get('logo'); }
  get contacto() { return this.registroForm.get('contacto'); }
  get telefono() { return this.registroForm.get('telefono'); }
  get correo() { return this.registroForm.get('correo'); }
  get direccion() { return this.registroForm.get('direccion'); }
}