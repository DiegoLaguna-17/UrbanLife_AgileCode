import { Component, inject,OnInit
 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UploadProyectoService } from './upload-proyecto.service';
import { Proyecto, Documento } from '../../componentes/card-proyecto/card-proyecto';

@Component({
  selector: 'app-registrar-documentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registrar-documentos.html',
  styleUrl: './registrar-documentos.scss'
})
export class RegistrarDocumentos {
    proyecto: Proyecto | null = null;
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

  constructor(private fb: FormBuilder,private uploadService: UploadProyectoService) {
    this.registroForm = this.fb.group({
      nombreDocumento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      tipoDocumento: ['', Validators.required],
      archivo: ['', [Validators.required, this.fileValidator.bind(this)]]
    });
  }
ngOnInit(){
  const navigation = this.router.getCurrentNavigation();
  const stateProyecto = navigation?.extras?.state?.['proyecto'];

  // 2. Si no existe (lo más común), intentar leer desde history.state
  const historyProyecto = history.state?.proyecto;

  const proyecto = stateProyecto || historyProyecto;
  this.proyecto=proyecto;
  console.log(this.proyecto)
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
  if (!this.registroForm.valid || !this.archivoSeleccionado) {
    this.marcarCamposComoTouched();
    this.mostrarModalError = true;
    return;
  }

  this.loading = true;

  try {
    // 1️⃣ Subir archivo a Supabase
    const url = await this.uploadService.subirDocumentoProyecto(this.archivoSeleccionado);

    if (!url) {
      this.loading = false;
      this.error = "No se pudo subir el archivo.";
      this.mostrarModalError = true;
      return;
    }

    console.log("URL obtenida:", url);

    // 2️⃣ Ahora enviar los datos al backend
    const body = {
      id_proyecto:this.proyecto?.id_proyecto,
      nombre_documento: this.nombreDocumento?.value,
      tipo: this.tipoDocumento?.value,
      ruta: url,
      fecha: new Date().toISOString()
    };

    console.log("Body final a enviar:", body);

    // Simular POST (reemplazar por tu endpoint real)
   await this.registrarDoc(body);

    

  } catch (err) {
    console.error("Error en registro:", err);
    this.error = "Ocurrió un error durante el registro.";
    this.mostrarModalError = true;
    this.loading = false;
  }
}


  // Simular registro (reemplazar con API real)
  registrarDoc(body:any): void {
    const url='http://127.0.0.1:8000/api/registrar_documento';
    this.http.post(url,body).subscribe({
      next:(response)=>{
        this.loading = false;
        this.mostrarModalExito=true
    this.registroForm.reset();
    this.archivoSeleccionado = null;
      },
      error:(err)=>{
        console.log('Error al registrar documento')
      }
    })
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