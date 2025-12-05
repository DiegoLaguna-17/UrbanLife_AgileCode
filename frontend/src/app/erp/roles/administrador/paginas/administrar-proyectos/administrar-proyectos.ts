import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CardProyecto, Proyecto } from '../../componentes/card-proyecto/card-proyecto';
import { map, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-administrar-proyectos',
  imports: [CommonModule, HttpClientModule, CardProyecto],
  templateUrl: './administrar-proyectos.html',
  styleUrl: './administrar-proyectos.scss'
})
export class AdministrarProyectos implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Señales reactivas
  proyectos = signal<Proyecto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  q = signal<string>(''); // Término de búsqueda

  // Computed para filtrar automáticamente
  proyectosFiltrados = computed(() => {
    const termino = this.q().toLowerCase().trim();
    if (!termino) return this.proyectos();
    return this.proyectos().filter(p =>
      p.nombre.toLowerCase().includes(termino)
    );
  });

  // Datos de prueba simulados
  private proyectosSimulados: Proyecto[] = [
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
    },
    {
      id_proyecto: 3,
      nombre: "Edificio Central",
      descripcion: "Oficinas corporativas",
      fecha_inicio: "2023-11-01",
      fecha_fin: "2025-08-15",
      estado: "En progreso",
      presupuesto: 3200000,
      departamento: "Construcción",
      nombre_empleado: "Carlos Rodríguez",
      documentos: [
        { nombre_documento: "Contrato de construcción", tipo: "PDF", ruta: "/docs/contrato.pdf" },
        { nombre_documento: "Plan de trabajo", tipo: "Excel", ruta: "/docs/plan.xlsx" }
      ],
      actividades: [
        { nombre_actividad: "Estructura", descripcion: "Armado de estructura metálica", fecha: "2024-01-10", estado: "Completada" },
        { nombre_actividad: "Instalaciones", descripcion: "Sistemas eléctricos y sanitarios", fecha: "2024-04-01", estado: "En progreso" }
      ]
    },
    {
      id_proyecto: 4,
      nombre: "Centro Comercial Mega",
      descripcion: "Complejo comercial con 50 locales",
      fecha_inicio: "2024-03-01",
      fecha_fin: "2025-12-31",
      estado: "Planificación",
      presupuesto: 4500000,
      departamento: "Desarrollo",
      nombre_empleado: "Ana García",
      documentos: [
        { nombre_documento: "Estudio de mercado", tipo: "PDF", ruta: "/docs/mercado.pdf" },
        { nombre_documento: "Diseño comercial", tipo: "PDF", ruta: "/docs/comercial.pdf" }
      ],
      actividades: [
        { nombre_actividad: "Adquisición de terreno", descripcion: "Compra del terreno", fecha: "2024-02-15", estado: "Completada" },
        { nombre_actividad: "Diseño arquitectónico", descripcion: "Desarrollo de planos", fecha: "2024-04-15", estado: "En progreso" }
      ]
    },
    {
      id_proyecto: 5,
      nombre: "Viviendas Sociales",
      descripcion: "100 viviendas de interés social",
      fecha_inicio: "2023-09-01",
      fecha_fin: "2025-06-30",
      estado: "Finalizado",
      presupuesto: 1500000,
      departamento: "Social",
      nombre_empleado: "Luis Fernández",
      documentos: [
        { nombre_documento: "Convenio municipal", tipo: "PDF", ruta: "/docs/convenio.pdf" },
        { nombre_documento: "Memoria descriptiva", tipo: "PDF", ruta: "/docs/memoria.pdf" }
      ],
      actividades: [
        { nombre_actividad: "Construcción de viviendas", descripcion: "Edificación de las 100 unidades", fecha: "2024-01-30", estado: "Completada" },
        { nombre_actividad: "Entrega de viviendas", descripcion: "Entrega a familias beneficiarias", fecha: "2024-05-15", estado: "Completada" }
      ]
    },
    {
      id_proyecto: 6,
      nombre: "Hospital Regional",
      descripcion: "Centro médico de tercer nivel",
      fecha_inicio: "2024-04-01",
      fecha_fin: "2028-10-31",
      estado: "Planificación",
      presupuesto: 8500000,
      departamento: "Salud",
      nombre_empleado: "Roberto Vargas",
      documentos: [
        { nombre_documento: "Proyecto ejecutivo", tipo: "PDF", ruta: "/docs/proyecto.pdf" },
        { nombre_documento: "Especificaciones técnicas", tipo: "PDF", ruta: "/docs/especificaciones.pdf" }
      ],
      actividades: [
        { nombre_actividad: "Estudio de impacto ambiental", descripcion: "Evaluación ambiental", fecha: "2024-03-15", estado: "En progreso" },
        { nombre_actividad: "Cotización de equipos", descripcion: "Presupuesto de equipamiento médico", fecha: "2024-05-01", estado: "Pendiente" }
      ]
    }
  ];

  // Cargar proyectos para misa datos de prueba
  cargarProyectos(): void {
    this.obtenerProyectos().subscribe({
      next: (proyectos) => {
        this.proyectos.set(proyectos);
        console.log("Proyectos cargados:", proyectos);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener proyectos:', err);
        this.error.set('Error al cargar los proyectos');
        this.loading.set(false);
        // En caso de error, cargamos datos simulados
        this.proyectos.set(this.proyectosSimulados);
        this.loading.set(false);
      }
    });
  }

  obtenerProyectos(): Observable<Proyecto[]> {
    // Simulamos una llamada HTTP
    return of(this.proyectosSimulados).pipe(delay(1000));
    
    // Para usar con back
    /*
    return this.http.get<any[]>("http://127.0.0.1:8000/api/get_all_proyectos").pipe(
      map(response =>
        response.map(item => ({
          id_proyecto: item.id_proyecto,
          nombre: item.nombre,
          descripción: item.descripcion,
          fecha_inicio: item.fecha_inicio,
          fecha_fin: item.fecha_fin,
          estado: item.estado,
          presupuesto: item.presupuesto,
          departamento: item.departamento,
          nombre_empleado: item.nombre_empleado,
          documentos: item.documentos || [],
          actividades: item.actividades || []
        }))
      )
    );
    */
  }

  // Ver proyecto
  verProyecto(proyecto: Proyecto): void {
    const proyectoString = JSON.stringify(proyecto);
    this.router.navigate(['./administrador/ver-proyecto'], { 
      queryParams: { proyecto: proyectoString }
    });
  }

  // Navegar a la página de registrar proyecto
  irARegistrar(): void {
    this.router.navigate(['./administrador/crear-proyectos']);
  }

  ngOnInit(): void {
    this.cargarProyectos();
  }
}