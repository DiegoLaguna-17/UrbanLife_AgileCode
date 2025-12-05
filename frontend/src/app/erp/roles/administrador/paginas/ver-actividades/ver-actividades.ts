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
  mostrarModalVer = false;

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
    this.router.navigate(['./administrador/ver-proyecto'], {
      queryParams: { proyecto: JSON.stringify(this.proyecto) }
    });
  }

  // Cambiar filtro
  cambiarFiltro(estado: string): void {
    this.filtroEstado = estado;
  }

  // Cambiar orden
  cambiarOrden(orden: string): void {
    this.ordenPor = orden;
  }

  // Ver actividad (abrir modal)
  verActividad(actividad: Actividad): void {
    this.actividadSeleccionada = actividad;
    this.mostrarModalVer = true;
  }

  // Cerrar modal
  cerrarModalVer(): void {
    this.mostrarModalVer = false;
    this.actividadSeleccionada = null;
  }

  // Editar actividad
  editarActividad(actividad: Actividad): void {
    console.log('Editar actividad:', actividad);
    alert(`Editar actividad: ${actividad.nombre_actividad}\nEstado actual: ${actividad.estado}`);
  }

  // Completar actividad
  completarActividad(actividad: Actividad): void {
    console.log('Completar actividad:', actividad);
    actividad.estado = 'Completada';
    alert(`Actividad "${actividad.nombre_actividad}" marcada como completada`);
  }

  // Iniciar actividad
  iniciarActividad(actividad: Actividad): void {
    console.log('Iniciar actividad:', actividad);
    actividad.estado = 'En progreso';
    alert(`Actividad "${actividad.nombre_actividad}" iniciada`);
  }
}