import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Proyecto, Actividad } from '../../componentes/card-proyecto/card-proyecto';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { UploadImagenService } from './upload-imagen.service';
@Component({
  selector: 'app-ver-actividades',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './ver-actividades.html',
  styleUrl: './ver-actividades.scss'
})
export class VerActividades implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private uploadService = inject(UploadImagenService);
  // Variables del componente
  proyecto: Proyecto | null = null;
  actividades: Actividad[] = [];
  filtroEstado = 'todas';
  ordenPor = 'fecha';
  actividadSeleccionada: Actividad | null = null;
  private http = inject(HttpClient);
  
  // Variables para los nuevos modales
  mostrarModalPendiente = false;
  mostrarModalEnProgreso = false;
  mostrarModalConfirmarCompletar = false;
  mostrarModalExito = false;
  
  // Variables para la imagen
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  
  // Mensajes
  mensajeExito = '';
  loading = false;

  // Computed para actividades filtradas
  actividadesFiltradas = computed(() => {
    let actividadesFiltradas = this.actividades;
    
    // Aplicar filtro por estado
    if (this.filtroEstado !== 'todas') {
      actividadesFiltradas = actividadesFiltradas.filter(
        actividad => actividad.estado === this.filtroEstado
      );
    }
    
    // Aplicar orden
    actividadesFiltradas = [...actividadesFiltradas].sort((a, b) => {
      switch(this.ordenPor) {
        case 'fecha':
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        case 'nombre':
          return a.nombre_actividad.localeCompare(b.nombre_actividad);
        case 'estado':
          return a.estado.localeCompare(b.estado);
        default:
          return 0;
      }
    });
    
    return actividadesFiltradas;
  });

  ngOnInit(): void {
    this.cargarProyecto();
  }

  // Cargar proyecto y actividades
private cargarProyecto(): void {
  // Intentamos primero con getCurrentNavigation (solo funciona durante la navegación)
  const navState = this.router.getCurrentNavigation()?.extras?.state as { proyecto?: Proyecto } | undefined;
  // Fallback a history.state (más confiable después de la navegación)
  const proyectoFromState = navState?.proyecto ?? (history.state && (history.state as any).proyecto) as Proyecto | undefined;

  if (proyectoFromState) {
  this.proyecto = proyectoFromState;
  this.actividades = this.proyecto?.actividades || [];

  // 🔥 Normalizar estados
  this.actividades = this.actividades.map(a => {
    const estado = a.estado.toLowerCase();

    if (estado === 'finalizado' || estado === 'completado') {
      return { ...a, estado: 'Completada' };
    }
    if (estado === 'en progreso' || estado === 'progreso') {
      return { ...a, estado: 'En progreso' };
    }
    if (estado === 'pendiente' || estado === 'sin iniciar') {
      return { ...a, estado: 'Pendiente' };
    }
    return a;
  });

  console.log('Proyecto recibido desde state (normalizado):', this.proyecto);
}
 else {
    console.warn('⚠ No se recibió ningún proyecto por state.');
  }
  
}



  // Filtrar actividades por estado específico
  actividadesFiltradasPorEstado(estado: string): Actividad[] {
    return this.actividadesFiltradas().filter(actividad => actividad.estado === estado);
  }

  // Contar actividades por estado
  contarPorEstado(estado: string): number {
    return this.actividades.filter(actividad => actividad.estado === estado).length;
  }

  // Contar total de actividades
  contarActividadesTotales(): number {
    return this.actividades.length;
  }

  // Calcular progreso general del proyecto
  calcularProgresoGeneral(): number {
    if (this.actividades.length === 0) return 0;
    
    const completadas = this.contarPorEstado('Completada');
    const enProgreso = this.contarPorEstado('En progreso');
    
    // Completadas valen 100%, en progreso valen 50%, pendientes 0%
    const progreso = (completadas * 100 + enProgreso * 50) / this.actividades.length;
    return Math.round(progreso);
  }

  // Obtener clase SCSS para el estado del proyecto
  getEstadoClass(): string {
    const estado = this.proyecto?.estado?.toLowerCase() || '';
    
    switch(estado) {
      case 'En progreso':
        return 'estado-progreso';
      case 'planificación':
        return 'estado-planificacion';
      case 'finalizado':
        return 'estado-finalizado';
      case 'cancelado':
        return 'estado-cancelado';
      default:
        return 'estado-default';
    }
  }

  // Obtener icono para actividad
  getActividadIcon(actividad: Actividad | null): string {
    if (!actividad) return '📋';
    
    switch(actividad.estado) {
      case 'Completada':
        return '✅';
      case 'En progreso':
        return '🔄';
      case 'Pendiente':
        return '⏳';
      default:
        return '📋';
    }
  }

  // Cargar datos de ejemplo
  /*
  private cargarDatosEjemplo(): void {
    this.proyecto = {
      id_proyecto: 1,
      nombre: "Condominio Lomas del Sol",
      descripcion: "Construcción de condominio residencial de lujo",
      fecha_inicio: "2024-01-15",
      fecha_fin: "2026-11-20",
      estado: "En progreso",
      presupuesto: 2500000,
      departamento: "Construcción",
      nombre_empleado: "Juan Pérez",
      documentos: [],
      actividades: [
        {
          nombre_actividad: "Excavación del terreno",
          descripcion: "Preparación del terreno y excavación para cimientos",
          fecha: "2024-02-01",
          estado: "Completada"
        },
        {
          nombre_actividad: "Cimentación y zapatas",
          descripcion: "Colocación de cimientos y zapatas estructurales",
          fecha: "2024-03-15",
          estado: "Completada"
        },
        {
          nombre_actividad: "Estructura metálica",
          descripcion: "Armado e instalación de estructura metálica principal",
          fecha: "2024-04-20",
          estado: "En progreso"
        },
        {
          nombre_actividad: "Instalaciones eléctricas",
          descripcion: "Tendido de cableado y sistema eléctrico principal",
          fecha: "2024-05-10",
          estado: "En progreso"
        },
        {
          nombre_actividad: "Instalaciones sanitarias",
          descripcion: "Sistema de tuberías para agua y desagüe",
          fecha: "2024-06-01",
          estado: "Pendiente"
        },
        {
          nombre_actividad: "Muros y tabiquería",
          descripcion: "Construcción de muros y divisiones internas",
          fecha: "2024-06-15",
          estado: "Pendiente"
        },
        {
          nombre_actividad: "Acabados interiores",
          descripcion: "Pintura, pisos y acabados de interiores",
          fecha: "2024-07-01",
          estado: "Pendiente"
        },
        {
          nombre_actividad: "Instalación de ventanas y puertas",
          descripcion: "Colocación de carpintería metálica y madera",
          fecha: "2024-07-20",
          estado: "Pendiente"
        },
        {
          nombre_actividad: "Acabados exteriores",
          descripcion: "Pintura y revestimiento de fachada",
          fecha: "2024-08-10",
          estado: "Pendiente"
        },
        {
          nombre_actividad: "Instalación de ascensores",
          descripcion: "Montaje de sistema de ascensores",
          fecha: "2024-08-25",
          estado: "Pendiente"
        },
        {
          nombre_actividad: "Áreas comunes",
          descripcion: "Construcción de áreas comunes y jardines",
          fecha: "2024-09-05",
          estado: "Pendiente"
        },
        {
          nombre_actividad: "Inspección final",
          descripcion: "Inspección y aprobación final de la obra",
          fecha: "2024-09-20",
          estado: "Pendiente"
        }
      ]
    };
    
    this.actividades = this.proyecto.actividades;
  }*/

  // Navegación
  volver(): void {
    this.router.navigate(['./jefeobra/ver-proyectos'], {
      queryParams: { proyecto: JSON.stringify(this.proyecto) }
    });
  }

  anadirActividad(): void {
    this.router.navigate(['/jefeobra/registrar-actividad'],{state: { proyecto: this.proyecto }});
  }

  // Cambiar filtro
  cambiarFiltro(estado: string): void {
    this.filtroEstado = estado;
  }

  // Cambiar orden
  cambiarOrden(orden: string): void {
    this.ordenPor = orden;
  }

  // ============= NUEVOS MÉTODOS =============

  // Seleccionar actividad (click en tarjeta)
  seleccionarActividad(actividad: Actividad): void {
    this.actividadSeleccionada = actividad;
    
    // Mostrar modal según estado
    switch(actividad.estado) {
      case 'Pendiente':
        this.mostrarModalPendiente = true;
        break;
      case 'En progreso':
        this.mostrarModalEnProgreso = true;
        break;
      case 'Completada':
        // No hacer nada o mostrar información
        break;
    }
  }

  // ========== MODAL PARA PENDIENTES ==========

  // Confirmar cambio a "En Progreso"
  confirmarCambioAEnProgreso(): void {
    if (this.actividadSeleccionada) {
      this.loading = true;
      
      // Simular cambio de estado
        const payload={
          id_actividad:this.actividadSeleccionada.id_actividad,
          estado:"en progreso"
        }
        console.log(payload)
        const url="http://127.0.0.1:8000/api/actividad_enprogreso";
        this.http.put(url,payload).subscribe({
          next:(response)=>{
          this.actividadSeleccionada!.estado = 'En progreso';
          this.mensajeExito = `La actividad "${this.actividadSeleccionada!.nombre_actividad}" ha sido cambiada a "En Progreso"`;
          this.mostrarModalPendiente = false;
          this.mostrarModalExito = true;
          console.log('Actividad actualizada:', this.actividadSeleccionada);
          },
          error:(err)=>{
            console.log("Error al cambiar actividad de estado a en progreso ",err)
          }
        });
        
        this.loading = false;
        
        
        // Aquí podrías agregar la lógica para actualizar en el backend
        
      
    }
  }

  cerrarModalPendiente(): void {
    this.mostrarModalPendiente = false;
    this.actividadSeleccionada = null;
  }

  // ========= MODAL PARA EN PROGRESO =========

  seleccionarOpcionCompletar(): void {
    this.mostrarModalEnProgreso = false;
    this.mostrarModalConfirmarCompletar = true;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (file.type.startsWith('image/')) {
        this.imagenSeleccionada = file;
        
        // Crear vista previa
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Por favor, seleccione solo archivos de imagen (JPG, PNG, etc.)');
      }
    }
  }

  async subirImagen(): Promise<void> {
  if (!this.imagenSeleccionada || !this.actividadSeleccionada) return;

  this.loading = true;

  try {
    // 1️⃣ Subir imagen a Supabase
    const urlImagen = await this.uploadService.subirImagenActividad(this.imagenSeleccionada);

    if (!urlImagen) {
      alert('No se pudo subir la imagen. Intente nuevamente.');
      this.loading = false;
      return;
    }

    // 2️⃣ Enviar URL al backend asociado a la actividad
    const payload = {
      id_actividad: this.actividadSeleccionada.id_actividad,
      nombre:this.actividadSeleccionada.nombre_actividad,
      ruta: urlImagen
    };
    const url = "http://127.0.0.1:8000/api/subir_imagen";
    this.http.post(url, payload).subscribe({
      next: (res) => {
        this.mensajeExito = `Imagen subida correctamente para "${this.actividadSeleccionada!.nombre_actividad}"`;
        this.mostrarModalEnProgreso = false;
        this.mostrarModalExito = true;
        console.log('Imagen asociada a actividad:', res);
      },
      error: (err) => {
        console.error('Error al asociar imagen:', err);
        alert('Error al registrar la imagen en el backend.');
      },
      complete: () => {
        
        this.cancelarImagen();
      }
    });
    this.loading = false;

  } catch (err) {
    console.error('Error al subir la imagen:', err);
    alert('Error inesperado al subir la imagen.');
    this.loading = false;
  }
}


  cancelarImagen(): void {
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
  }

  cerrarModalEnProgreso(): void {
    this.mostrarModalEnProgreso = false;
    this.actividadSeleccionada = null;
    this.cancelarImagen();
  }

  // ===== MODAL DE CONFIRMACIÓN PARA COMPLETAR =====

  confirmarCambioACompletada(): void {
    if (this.actividadSeleccionada) {
      this.loading = true;
      const payload={
          id_actividad:this.actividadSeleccionada.id_actividad,
          estado:"finalizado"
        }
        const url="http://127.0.0.1:8000/api/actividad_finalizado"
      // Simular cambio de estado
      this.http.put(url,payload).subscribe({
        next:(response)=>{
          this.actividadSeleccionada!.estado = 'Completada';
        this.mensajeExito = `La actividad "${this.actividadSeleccionada!.nombre_actividad}" ha sido marcada como "Completada"`;
        this.mostrarModalConfirmarCompletar = false;
        this.mostrarModalExito = true;
        },
        error:(err)=>{
          console.log("Error al actualizar estado finalizado ",err)
        }
      })
        
        this.loading = false;
        
        
        // Aquí podrías agregar la lógica para actualizar en el backend
        console.log('Actividad completada:', this.actividadSeleccionada);
      
    }
  }

  cerrarModalConfirmarCompletar(): void {
    this.mostrarModalConfirmarCompletar = false;
    this.actividadSeleccionada = null;
  }

  // ========= MODAL DE ÉXITO =========

  cerrarModalExito(): void {
    this.mostrarModalExito = false;
    this.actividadSeleccionada = null;
  }

  // ========= MÉTODOS ANTIGUOS (mantener compatibilidad) =========

  // Ver actividad (abrir modal) - DEPRECADO
  verActividad(actividad: Actividad): void {
    // Mantener para compatibilidad, pero redirigir al nuevo sistema
    this.seleccionarActividad(actividad);
  }

  // Cerrar modal - DEPRECADO
  cerrarModalVer(): void {
    // Mantener para compatibilidad
    this.cerrarModalPendiente();
    this.cerrarModalEnProgreso();
  }

  // Editar actividad - MANTENER
  editarActividad(actividad: Actividad): void {
    console.log('Editar actividad:', actividad);
    alert(`Editar actividad: ${actividad.nombre_actividad}\nEstado actual: ${actividad.estado}`);
  }

  // Completar actividad - DEPRECADO
  completarActividad(actividad: Actividad): void {
    // Redirigir al nuevo sistema
    this.actividadSeleccionada = actividad;
    this.seleccionarOpcionCompletar();
  }

  // Iniciar actividad - DEPRECADO
  iniciarActividad(actividad: Actividad): void {
    // Redirigir al nuevo sistema
    this.actividadSeleccionada = actividad;
    this.mostrarModalPendiente = true;
  }
}