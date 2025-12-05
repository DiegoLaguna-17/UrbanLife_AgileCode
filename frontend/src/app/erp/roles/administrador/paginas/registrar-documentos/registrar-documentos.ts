import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registrar-documentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registrar-documentos.html',
  styleUrl: './registrar-documentos.scss'
})
export class RegistrarDocumentos {
  registroForm: FormGroup;
  private router = inject(Router);
  private http = inject(HttpClient);
  
  // Variables de control
  archivoSeleccionado: File | null = null;
  mostrarModalExito: boolean = false;
  mostrarModalError: boolean = false;
  loading: boolean = false;
  error: string = '';
  
  // Opciones para el tipo de documento
  tiposDocumento = [
    { value: 'contrato', label: 'Contratos' },
    { value: 'permiso', label: 'Permisos' },
    { value: 'plano', label: 'Planos' },
    { value: 'estudio', label: 'Estudios' }
  ];

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      nombreDocumento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      tipoDocumento: ['', Validators.required],
      archivo: ['', [Validators.required, this.fileValidator.bind(this)]]
    });
  }

  // Validador personalizado para archivos
  private fileValidator(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    
    if (!file) {
      return { required: true };
    }

    if (file instanceof File) {
      // Validar tamaño (10MB máximo)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return { maxSize: true };
      }

      // Validar tipo de archivo
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'application/zip',
        'application/x-rar-compressed'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        // Verificar por extensión también
        const extension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'zip', 'rar'];
        
        if (!extension || !allowedExtensions.includes(extension)) {
          return { invalidType: true };
        }
      }
    }

    return null;
  }

  // Método para volver a la página principal
  volver(): void {
    this.router.navigate(['./administrador/ver-documentacion']);
  }

  // Manejar selección de archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      
      // Validar el archivo
      const validationResult = this.fileValidator({ value: file } as AbstractControl);
      
      if (validationResult) {
        // Mostrar mensaje de error específico
        if (validationResult['maxSize']) {
          alert('El archivo es demasiado grande. Máximo 10MB.');
        } else if (validationResult['invalidType']) {
          alert('Formato de archivo no permitido. Use PDF, DOC, JPG, PNG, ZIP o RAR.');
        }
        this.archivoSeleccionado = null;
        this.archivo?.setValue('');
      } else {
        this.archivo?.setValue(file);
      }
    }
  }

  // Envío del formulario
  async onSubmit() {
    if (!this.registroForm.valid) {
      this.marcarCamposComoTouched();
      this.mostrarModalError = true;
      return;
    }

    this.loading = true;
    
    // Crear FormData para enviar
    const formData = new FormData();
    formData.append('nombre', this.nombreDocumento?.value);
    formData.append('tipo', this.tipoDocumento?.value);
    formData.append('archivo', this.archivoSeleccionado as File);

    // Simular llamada al API (reemplazar con llamada real)
    this.simularRegistroDocumento(formData);
  }

  // Simular registro (reemplazar con API real)
  simularRegistroDocumento(formData: FormData): void {
    setTimeout(() => {
      this.loading = false;
      
      // Mostrar datos en consola para pruebas
      console.log('Datos del documento a enviar:');
      console.log('Nombre:', formData.get('nombre'));
      console.log('Tipo:', formData.get('tipo'));
      console.log('Archivo:', this.archivoSeleccionado?.name);
      
      // Simular éxito
      this.registroForm.reset();
      this.archivoSeleccionado = null;
      this.mostrarModalExito = true;
    }, 2000);
  }

  // Métodos para modales
  cerrarModalExito(): void {
    this.mostrarModalExito = false;
    this.volver();
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
  }

  private marcarCamposComoTouched(): void {
    Object.keys(this.registroForm.controls).forEach(key => {
      this.registroForm.get(key)?.markAsTouched();
    });
  }

  // Getters para fácil acceso a los controles
  get nombreDocumento() { return this.registroForm.get('nombreDocumento'); }
  get tipoDocumento() { return this.registroForm.get('tipoDocumento'); }
  get archivo() { return this.registroForm.get('archivo'); }
}