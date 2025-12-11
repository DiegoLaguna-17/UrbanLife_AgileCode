import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Proyecto, Actividad } from '../../componentes/card-proyecto/card-proyecto';

@Component({
  selector: 'app-ver-actividades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-actividades.html',
  styleUrl: './ver-actividades.scss'
})
export class VerActividades implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Variables del componente
  proyecto: Proyecto | null = null;
  actividades: Actividad[] = [];
  filtroEstado = 'todas';
  ordenPor = 'fecha';
  actividadSeleccionada: Actividad | null = null;
  
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
    this.route.queryParams.subscribe(params => {
      const proyectoParam = params['proyecto'];
      if (proyectoParam) {
        try {
          this.proyecto = JSON.parse(proyectoParam);
          this.actividades = this.proyecto?.actividades || [];
          console.log('Proyecto cargado:', this.proyecto);
        } catch (e) {
          console.error('Error parsing proyecto:', e);
          this.cargarDatosEjemplo();
        }
      } else {
        // Intentar obtener del state
        const navigation = this.router.getCurrentNavigation();
        const proyectoFromState = navigation?.extras?.state?.['proyecto'] as Proyecto;
        
        if (proyectoFromState) {
          this.proyecto = proyectoFromState;
          this.actividades = this.proyecto?.actividades || [];
        } else {
          this.cargarDatosEjemplo();
        }
      }
    });
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
      case 'en progreso':
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
  }

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
      setTimeout(() => {
        this.actividadSeleccionada!.estado = 'En progreso';
        this.mensajeExito = `La actividad "${this.actividadSeleccionada!.nombre_actividad}" ha sido cambiada a "En Progreso"`;
        this.loading = false;
        this.mostrarModalPendiente = false;
        this.mostrarModalExito = true;
        
        // Aquí podrías agregar la lógica para actualizar en el backend
        console.log('Actividad actualizada:', this.actividadSeleccionada);
      }, 1000);
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

  subirImagen(): void {
    if (this.imagenSeleccionada && this.actividadSeleccionada) {
      this.loading = true;
      
      // Simular subida de imagen
      setTimeout(() => {
        console.log('Imagen subida para actividad:', this.actividadSeleccionada?.nombre_actividad);
        console.log('Archivo:', this.imagenSeleccionada);
        
        this.mensajeExito = `Imagen subida correctamente para la actividad "${this.actividadSeleccionada!.nombre_actividad}"`;
        this.loading = false;
        this.mostrarModalEnProgreso = false;
        this.mostrarModalExito = true;
        
        // Limpiar datos de imagen
        this.cancelarImagen();
        
        // Aquí podrías agregar la lógica para subir la imagen al backend
        // y asociarla a la actividad
      }, 1500);
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
      
      // Simular cambio de estado
      setTimeout(() => {
        this.actividadSeleccionada!.estado = 'Completada';
        this.mensajeExito = `La actividad "${this.actividadSeleccionada!.nombre_actividad}" ha sido marcada como "Completada"`;
        this.loading = false;
        this.mostrarModalConfirmarCompletar = false;
        this.mostrarModalExito = true;
        
        // Aquí podrías agregar la lógica para actualizar en el backend
        console.log('Actividad completada:', this.actividadSeleccionada);
      }, 1000);
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