import { Component, inject,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UploadProyectoService } from '../registrar-documentos/upload-proyecto.service';
@Component({
  selector: 'app-crear-proyectos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './crear-proyectos.html',
  styleUrl: './crear-proyectos.scss'
})
export class CrearProyectos {
  registroForm: FormGroup;
  private router = inject(Router);
  private http = inject(HttpClient);
  private uploadService = inject(UploadProyectoService);

  // Variables de control
  pasoActual: number = 1;
  contratoArchivo: File | null = null;
  planoArchivo: File | null = null;
  permisosArchivo: File | null = null;
  mostrarModalExito: boolean = false;
  mostrarModalError: boolean = false;
  loading: boolean = false;
  error: string = '';
  
  // Datos de prueba para jefes de obra
  jefesObra:any= [];

  // Opciones de departamento
  departamentos = ['La Paz', 'Cochabamba', 'Santa Cruz'];

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      // Paso 1: Información básica del proyecto
      nombreProyecto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      fechaInicio: ['', Validators.required],
      fechaFinalizacion: ['', Validators.required],
      departamento: ['', Validators.required],
      
      // Paso 2: Información financiera y documentación
      presupuesto: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      id_usuario: ['', Validators.required],
      contrato: [''],
      plano: [''],
      permisosLegales: ['']
    });
  }
  ngOnInit(){
    this.cargarJefes();
  }
  // Método para volver a la página principal
  volver(): void {
    this.router.navigate(['./administrador/crear-proyectos']);
  }

  // Manejar selección de archivos
  onFileSelected(event: any, tipo: string): void {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. Máximo 10MB.');
        return;
      }

      // Validar tipos de archivo
      if (tipo === 'contrato' || tipo === 'permisos') {
        if (file.type !== 'application/pdf') {
          alert('Por favor, seleccione un archivo PDF');
          return;
        }
      } else if (tipo === 'plano') {
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
          alert('Formato de archivo no permitido para planos');
          return;
        }
      }

      // Asignar archivo según el tipo
      switch (tipo) {
        case 'contrato':
          this.contratoArchivo = file;
          this.contrato?.setValue(file.name);
          break;
        case 'plano':
          this.planoArchivo = file;
          this.plano?.setValue(file.name);
          break;
        case 'permisos':
          this.permisosArchivo = file;
          this.permisosLegales?.setValue(file.name);
          break;
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
    const controlesPaso1 = ['nombreProyecto', 'descripcion', 'fechaInicio', 'fechaFinalizacion', 'departamento'];
    return controlesPaso1.every(control => this.registroForm.get(control)?.valid);
  }

  // Validar fechas
  validarFechas(): boolean {
    const inicio = new Date(this.fechaInicio?.value);
    const fin = new Date(this.fechaFinalizacion?.value);
    return fin > inicio;
  }

  // Marcar campos del paso 1 como touched
  private marcarCamposPaso1ComoTouched(): void {
    const controlesPaso1 = ['nombreProyecto', 'descripcion', 'fechaInicio', 'fechaFinalizacion', 'departamento'];
    controlesPaso1.forEach(control => {
      this.registroForm.get(control)?.markAsTouched();
    });
  }

  // Envío del formulario
  async onSubmit() {
    if (!this.registroForm.valid) {
      this.marcarCamposComoTouched();
      this.mostrarModalError = true;
      return;
    }

    if (!this.validarFechas()) {
      alert('La fecha de finalización debe ser posterior a la fecha de inicio');
      this.fechaFinalizacion?.setErrors({ 'fechaInvalida': true });
      return;
    }

    // Crear FormData para enviar archivos
    const formData = new FormData();

    // Agregar datos del formulario
    Object.keys(this.registroForm.controls).forEach(key => {
      if (key !== 'contrato' && key !== 'plano' && key !== 'permisosLegales') {
        formData.append(key, this.registroForm.get(key)?.value);
      }
    });

    // Agregar archivos 
    if (this.contratoArchivo) {
      formData.append('contrato', this.contratoArchivo);
    }
    if (this.planoArchivo) {
      formData.append('plano', this.planoArchivo);
    }
    if (this.permisosArchivo) {
      formData.append('permisosLegales', this.permisosArchivo);
    }
    let id_empleado_jefe:number=0;
    this.jefesObra.forEach((a:any)=>{
      if(a.id_usuario==formData.get('id_usuario')){
        id_empleado_jefe=a.id_empleado
      }
    });

    formData.append('id_empleado',id_empleado_jefe.toString());
    // Aquí iría la llamada al endpoint real
    this.EnvioProyecto(formData);
  }

  // Simula que se envia
  EnvioProyecto(formData: FormData): void {
    this.loading = true;
    this.error = '';

    // Simular llamada API
    
      this.loading = false;
      
      // Mostrar datos en consola (para pruebas)
      console.log('Datos del proyecto a enviar:');
     
       formData.forEach((value, key) => {
        console.log(key, value);
      });

      this.registroProyecto(formData);
      // Simular éxito
      
    
  }

registroProyecto(formData: FormData){

    const body= {
      nombre:formData.get('nombreProyecto'),
      descripcion:formData.get('descripcion'),
      fecha_inicio:formData.get('fechaInicio'),
      fecha_fin:formData.get('fechaFinalizacion'),
      estado:'en construccion',
      presupuesto:formData.get('presupuesto'),
      departamento:formData.get('departamento'),
      id_usuario:formData.get('id_usuario'),
      id_empleado:formData.get('id_empleado')
    };
    const url="http://127.0.0.1:8000/api/registrar_proyecto";
    this.http.post(url,body).subscribe({
      next:(response:any)=>{
        console.log(response);
         this.subirArchivos(response.data.id_proyecto)
      },
      error:(err)=>{
        console.log(err)
      }
    })
   
  }
  async subirArchivos(id_proyecto:any){

  try {

    // 🌟 1. Subir archivos a Supabase
    let contratoUrl = null;
    let planoUrl = null;
    let permisosUrl = null;

    if (this.contratoArchivo) {
      contratoUrl = await this.uploadService.subirDocumentoProyecto(this.contratoArchivo);
      console.log("URL contrato:", contratoUrl);
    }

    if (this.planoArchivo) {
      planoUrl = await this.uploadService.subirDocumentoProyecto(this.planoArchivo);
      console.log("URL plano:", planoUrl);
    }

    if (this.permisosArchivo) {
      permisosUrl = await this.uploadService.subirDocumentoProyecto(this.permisosArchivo);
      console.log("URL permisos:", permisosUrl);
    }

     const body1 = {
      id_proyecto:id_proyecto,
      nombre_documento: this.contratoArchivo?.name,
      tipo: 'Contrato',
      ruta: contratoUrl,
      fecha: new Date().toISOString()
    };
    await this.registrarDoc(body1)

    const body2 = {
      id_proyecto:id_proyecto,
      nombre_documento: this.planoArchivo?.name,
      tipo: 'Planos',
      ruta: planoUrl,
      fecha: new Date().toISOString()
    };
  await this.registrarDoc(body2)

    const body3 = {
      id_proyecto:id_proyecto,
      nombre_documento: this.permisosArchivo?.name,
      tipo: 'Permisos',
      ruta: permisosUrl,
      fecha: new Date().toISOString()
    };
    await this.registrarDoc(body3);

    this.registroForm.reset();
      this.pasoActual = 1;
      this.contratoArchivo=null;
      this.permisosArchivo=null;
      this.planoArchivo=null;
      this.mostrarModalExito = true;

  } catch (error) {
    console.error("Error final:", error);
    this.error = "Error al crear el proyecto";
    this.loading = false;
    this.mostrarModalError = true;
  }

  }
   registrarDoc(body:any): void {
    const url='http://127.0.0.1:8000/api/registrar_documento';
    this.http.post(url,body).subscribe({
      next:(response)=>{
        console.log('archivo Registrado')
      },
      error:(err)=>{
        console.log('Error al registrar documento ',err.error)
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

  // Método para formatear presupuesto
  formatearPresupuesto(event: any): void {
    let value = event.target.value.replace(/[^0-9.]/g, '');
    if (value) {
      const numero = parseFloat(value);
      if (!isNaN(numero)) {
        this.presupuesto?.setValue(numero.toFixed(2));
      }
    }
  }
  cargarJefes(){
    const url='http://127.0.0.1:8000/api/get_jefes_de_obra';
    this.http.get<any[]>(url).subscribe({
      next:(response)=>{
        this.jefesObra=response;
        console.log(this.jefesObra)
      },
      error:(err)=>{
        console.log('Error al cargar jefes de obra')
      }

    })
  }
  // Getters para fácil acceso a los controles del formulario
  get nombreProyecto() { return this.registroForm.get('nombreProyecto'); }
  get descripcion() { return this.registroForm.get('descripcion'); }
  get fechaInicio() { return this.registroForm.get('fechaInicio'); }
  get fechaFinalizacion() { return this.registroForm.get('fechaFinalizacion'); }
  get departamento() { return this.registroForm.get('departamento'); }
  get presupuesto() { return this.registroForm.get('presupuesto'); }
  get jefeObra() { return this.registroForm.get('jefeObra'); }
  get contrato() { return this.registroForm.get('contrato'); }
  get plano() { return this.registroForm.get('plano'); }
  get permisosLegales() { return this.registroForm.get('permisosLegales'); }
}