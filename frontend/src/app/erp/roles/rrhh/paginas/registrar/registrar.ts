import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadService } from './upload.service';
import { HttpClient,HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './registrar.html',
  styleUrl: './registrar.scss'
})
export class Registrar {
  registroForm: FormGroup;
  contratoArchivo: File | null = null;
  private http = inject(HttpClient);
  constructor(private fb: FormBuilder,private uploadService: UploadService) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      puesto: ['', [Validators.required, Validators.minLength(3)]],
      contrato: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea PDF
      if (file.type === 'application/pdf') {
        this.contratoArchivo = file;
        this.contrato?.setValue(file.name);
        this.contrato?.markAsTouched();
      } else {
        alert('Por favor, seleccione un archivo PDF');
        this.contratoArchivo = null;
        this.contrato?.setValue('');
      }
    }
  }

  async onSubmit(): Promise<void> {
  if (this.registroForm.invalid || !this.contratoArchivo) {
    this.marcarCamposComoTouched();
    return;
  }

  // 1. Subir contrato al bucket y obtener URL
  const urlContrato = await this.uploadService.subirContratoPDF(this.contratoArchivo);

  if (!urlContrato) {
    alert("Error al subir el contrato a Supabase");
    return;
  }

  // 2. Crear objeto final del empleado
  const empleadoData = {
    nombre: this.registroForm.value.nombre,
    puesto: this.registroForm.value.puesto,
    contrato: urlContrato     // <<--- AQUÍ SOLO LA URL DEL PDF
  };

  console.log("Empleado listo para guardar:", empleadoData);

  // Aquí ya puedes enviarlo a tu backend si quieres
  this.guardarEmpleado(empleadoData)
  this.registroForm.reset();
  this.contratoArchivo = null;
}
registroExitoso:boolean=false;
guardarEmpleado(empleadoData:any){
  const url = 'http://127.0.0.1:8000/api/registrar_empleado';
  this.http.post(url,empleadoData).subscribe({
    next:(respuesta)=>{
      this.registroExitoso=true;
      //alert('Empleado registrado');
    }, error:(err)=>{
      alert('Error al registrar empleado');
      console.log(err);
    }
  })
}
cerrarModalExito(){
this.registroExitoso=false;
}

  private marcarCamposComoTouched(): void {
    Object.keys(this.registroForm.controls).forEach(key => {
      this.registroForm.get(key)?.markAsTouched();
    });
  }

  // Getters para fácil acceso en el template
  get nombre() { return this.registroForm.get('nombre'); }
  get puesto() { return this.registroForm.get('puesto'); }
  get contrato() { return this.registroForm.get('contrato'); }
}
