import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Proyecto } from '../../componentes/card-proyecto/card-proyecto';

@Component({
  selector: 'app-ver-proyecto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-proyecto.html',
  styleUrl: './ver-proyecto.scss'
})
export class VerProyecto implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Variables del componente
  proyecto: Proyecto | null = null;
  mostrarError = false;
  mensajeError = '';

  // Datos de prueba (para desarrollo)
  private proyectosEjemplo: Proyecto[] = [
    {
      id_proyecto: 1,
      nombre: "Condominio Lomas del Sol",
      descripcion: "Construcción de condominio residencial de lujo",
      fecha_inicio: "2024-01-15",
      fecha_fin: "2026-11-20",
      estado: "En progreso",
      presupuesto: 2500000,
      departamento: "Construcción",
      nombre_empleado: "Juan Pérez",
      documentos: [
        { nombre_documento: "Planos arquitectónicos", tipo: "PDF", ruta: "/docs/planos.pdf" },
        { nombre_documento: "Permisos municipales", tipo: "PDF", ruta: "/docs/permisos.pdf" }
      ],
      actividades: [
        { nombre_actividad: "Excavación", descripcion: "Preparación del terreno", fecha: "2024-02-01", estado: "Completada" },
        { nombre_actividad: "Cimentación", descripcion: "Colocación de cimientos", fecha: "2024-03-15", estado: "En progreso" }
      ]
    },
    {
      id_proyecto: 2,
      nombre: "Puente Viacha",
      descripcion: "Construcción de puente vehicular",
      fecha_inicio: "2024-02-01",
      fecha_fin: "2027-11-20",
      estado: "Planificación",
      presupuesto: 1800000,
      departamento: "Infraestructura",
      nombre_empleado: "María López",
      documentos: [
        { nombre_documento: "Estudio de suelo", tipo: "PDF", ruta: "/docs/suelo.pdf" },
        { nombre_documento: "Diseño estructural", tipo: "CAD", ruta: "/docs/diseno.cad" }
      ],
      actividades: [
        { nombre_actividad: "Estudio de viabilidad", descripcion: "Análisis técnico-económico", fecha: "2024-01-15", estado: "Completada" },
        { nombre_actividad: "Licitación", descripcion: "Proceso de selección de contratistas", fecha: "2024-03-01", estado: "En progreso" }
      ]
    }
  ];

  ngOnInit(): void {
    this.cargarProyecto();
  }

  // Cargar proyecto desde la ruta
  private cargarProyecto(): void {
    // Intentar obtener del estado de la navegación
    const navigation = this.router.getCurrentNavigation();
    const proyectoFromState = navigation?.extras?.state?.['proyecto'] as Proyecto;
    
    if (proyectoFromState) {
      this.proyecto = proyectoFromState;
      console.log('Proyecto cargado desde state:', this.proyecto);
      return;
    }

    // Si no viene en el state, intentar obtener de queryParams
    this.route.queryParams.subscribe(params => {
      const proyectoParam = params['proyecto'];
      if (proyectoParam) {
        try {
          this.proyecto = JSON.parse(proyectoParam);
          console.log('Proyecto cargado desde query params:', this.proyecto);
          return;
        } catch (e) {
          console.error('Error parsing proyecto from query params:', e);
        }
      }

      // Si no se encuentra, intentar obtener por ID
      const idParam = params['id'];
      if (idParam) {
        this.cargarProyectoPorId(Number(idParam));
        return;
      }

      // Si no se encuentra de ninguna forma, mostrar error
      this.mensajeError = 'No se encontró información del proyecto.';
      this.mostrarError = true;
      console.warn('No se pudo cargar el proyecto, usando datos de ejemplo');
      this.proyecto = this.proyectosEjemplo[0]; // Datos de ejemplo para desarrollo
    });
  }

  // Cargar proyecto por ID (simulado)
  private cargarProyectoPorId(id: number): void {
    // Aquí iría la llamada al backend
    // Por ahora usamos datos de ejemplo
    const proyectoEncontrado = this.proyectosEjemplo.find(p => p.id_proyecto === id);
    
    if (proyectoEncontrado) {
      this.proyecto = proyectoEncontrado;
    } else {
      this.mensajeError = `No se encontró el proyecto con ID ${id}`;
      this.mostrarError = true;
      this.proyecto = this.proyectosEjemplo[0]; // Datos de ejemplo
    }
  }

  // Calcular duración del proyecto
  calcularDuracion(): number {
    if (!this.proyecto?.fecha_inicio || !this.proyecto?.fecha_fin) return 0;
    
    const inicio = new Date(this.proyecto.fecha_inicio);
    const fin = new Date(this.proyecto.fecha_fin);
    const diferenciaMs = fin.getTime() - inicio.getTime();
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  }

  // Calcular progreso estimado
  calcularProgreso(): number {
    if (!this.proyecto?.fecha_inicio || !this.proyecto?.fecha_fin) return 0;
    
    const inicio = new Date(this.proyecto.fecha_inicio);
    const fin = new Date(this.proyecto.fecha_fin);
    const hoy = new Date();
    
    const totalDias = this.calcularDuracion();
    const diasTranscurridos = Math.ceil((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasTranscurridos <= 0) return 0;
    if (diasTranscurridos >= totalDias) return 100;
    
    return Math.round((diasTranscurridos / totalDias) * 100);
  }

  // Obtener clase CSS para el estado
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

  // Navegación
  volver(): void {
    this.router.navigate(['./administrador/administrar-proyectos']);
  }

  verDocumentacion(): void {
    if (this.proyecto) {
      this.router.navigate(['./administrador/ver-documentacion'], {
        state: { proyecto: this.proyecto }
      });
    }
  }

  verActividades(): void {
    if (this.proyecto) {
      this.router.navigate(['./administrador/ver-actividades'], {
        state: { proyecto: this.proyecto }
      });
    }
  }

  // Cerrar modal de error
  cerrarModalError(): void {
    this.mostrarError = false;
    this.volver();
  }
}