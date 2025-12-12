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
  totalProyectos = 0;
  
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
      nombre: 'Renovación Plaza Central',
      descripcion: 'Remodelación completa de la plaza principal del municipio',
      fecha_inicio: '2024-01-15',
      fecha_fin: '2024-06-30',
      estado: 'En progreso',
      presupuesto: 500000,
      departamento: 'Obras Públicas',
      nombre_empleado: 'Carlos Rodríguez',
      documentos: [
        {
          nombre_documento: 'Plano de remodelación',
          tipo: 'PDF',
          ruta: '/documentos/plano_plaza.pdf'
        },
        {
          nombre_documento: 'Presupuesto aprobado',
          tipo: 'Excel',
          ruta: '/documentos/presupuesto_plaza.xlsx'
        }
      ],
      actividades: [
        {
          nombre_actividad: 'Diseño arquitectónico',
          descripcion: 'Creación de planos y diseño de la nueva plaza',
          fecha: '2024-01-20',
          estado: 'Completado'
        },
        {
          nombre_actividad: 'Demolición área antigua',
          descripcion: 'Remoción de estructuras existentes',
          fecha: '2024-02-10',
          estado: 'En progreso'
        }
      ]
    },
    {
      id_proyecto: 2,
      nombre: 'Sistema de Alumbrado Público',
      descripcion: 'Instalación de luces LED en avenidas principales',
      fecha_inicio: '2024-03-01',
      fecha_fin: '2024-08-15',
      estado: 'Planificado',
      presupuesto: 320000,
      departamento: 'Energía',
      nombre_empleado: 'María González',
      documentos: [
        {
          nombre_documento: 'Contrato de suministro',
          tipo: 'PDF',
          ruta: '/documentos/contrato_luces.pdf'
        }
      ],
      actividades: [
        {
          nombre_actividad: 'Estudio de viabilidad',
          descripcion: 'Análisis técnico y económico del proyecto',
          fecha: '2024-03-15',
          estado: 'Pendiente'
        }
      ]
    },
    {
      id_proyecto: 3,
      nombre: 'Programa de Reforestación Urbana',
      descripcion: 'Plantación de 1000 árboles en áreas urbanas',
      fecha_inicio: '2023-10-01',
      fecha_fin: '2024-05-30',
      estado: 'Completado',
      presupuesto: 150000,
      departamento: 'Medio Ambiente',
      nombre_empleado: 'Ana López',
      documentos: [
        {
          nombre_documento: 'Informe final de reforestación',
          tipo: 'PDF',
          ruta: '/documentos/informe_reforestacion.pdf'
        },
        {
          nombre_documento: 'Lista de especies',
          tipo: 'Word',
          ruta: '/documentos/especies_arboles.docx'
        }
      ],
      actividades: [
        {
          nombre_actividad: 'Selección de especies',
          descripcion: 'Elección de árboles adecuados para la zona urbana',
          fecha: '2023-10-10',
          estado: 'Completado'
        },
        {
          nombre_actividad: 'Plantación masiva',
          descripcion: 'Jornada de plantación comunitaria',
          fecha: '2023-11-05',
          estado: 'Completado'
        },
        {
          nombre_actividad: 'Monitoreo y cuidado',
          descripcion: 'Seguimiento del crecimiento de los árboles',
          fecha: '2024-04-01',
          estado: 'Completado'
        }
      ]
    },
    {
      id_proyecto: 4,
      nombre: 'Modernización Centro Deportivo',
      descripcion: 'Renovación de instalaciones deportivas municipales',
      fecha_inicio: '2024-02-01',
      fecha_fin: '2024-10-31',
      estado: 'En progreso',
      presupuesto: 750000,
      departamento: 'Deporte',
      nombre_empleado: 'Juan Pérez',
      documentos: [
        {
          nombre_documento: 'Proyecto arquitectónico',
          tipo: 'PDF',
          ruta: '/documentos/proyecto_deportivo.pdf'
        },
        {
          nombre_documento: 'Cronograma de obra',
          tipo: 'Excel',
          ruta: '/documentos/cronograma.xlsx'
        }
      ],
      actividades: [
        {
          nombre_actividad: 'Licitación de contratistas',
          descripcion: 'Proceso de selección de empresa constructora',
          fecha: '2024-01-20',
          estado: 'Completado'
        },
        {
          nombre_actividad: 'Construcción piscina olímpica',
          descripcion: 'Edificación de nueva piscina semiolímpica',
          fecha: '2024-03-01',
          estado: 'En progreso'
        }
      ]
    },
    {
      id_proyecto: 5,
      nombre: 'Campaña de Salud Comunitaria',
      descripcion: 'Jornadas médicas gratuitas en barrios vulnerables',
      fecha_inicio: '2024-04-01',
      fecha_fin: '2024-09-30',
      estado: 'Planificado',
      presupuesto: 85000,
      departamento: 'Salud',
      nombre_empleado: 'Laura Martínez',
      documentos: [
        {
          nombre_documento: 'Plan de implementación',
          tipo: 'PDF',
          ruta: '/documentos/plan_salud.pdf'
        }
      ],
      actividades: [
        {
          nombre_actividad: 'Coordinación con hospitales',
          descripcion: 'Organización de recursos médicos',
          fecha: '2024-03-15',
          estado: 'Pendiente'
        }
      ]
    },
    {
      id_proyecto: 6,
      nombre: 'Techado Canchas Municipales',
      descripcion: 'Instalación de techos en canchas de básquetbol',
      fecha_inicio: '2023-11-15',
      fecha_fin: '2024-02-28',
      estado: 'Completado',
      presupuesto: 120000,
      departamento: 'Deporte',
      nombre_empleado: 'Roberto Sánchez',
      documentos: [
        {
          nombre_documento: 'Acta de recepción de obra',
          tipo: 'PDF',
          ruta: '/documentos/recepcion_canchas.pdf'
        },
        {
          nombre_documento: 'Fotos del proyecto',
          tipo: 'ZIP',
          ruta: '/documentos/fotos_canchas.zip'
        }
      ],
      actividades: [
        {
          nombre_actividad: 'Compra de materiales',
          descripcion: 'Adquisición de estructuras metálicas y policarbonato',
          fecha: '2023-11-20',
          estado: 'Completado'
        },
        {
          nombre_actividad: 'Instalación estructuras',
          descripcion: 'Montaje de los techos en las canchas',
          fecha: '2023-12-10',
          estado: 'Completado'
        }
      ]
    }
  ];

  // Cargar proyectos con datos de prueba
  cargarProyectos(): void {
    this.obtenerProyectos().subscribe({
      next: (proyectos) => {
        this.totalProyectos = proyectos.length;
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
        this.totalProyectos = this.proyectosSimulados.length;
        this.loading.set(false);
      }
    });
  }

  obtenerProyectos(): Observable<Proyecto[]> {
    // Simulamos una llamada HTTP con delay de 1 segundo
    /*
    return of(this.proyectosSimulados).pipe(
      delay(1000) // Simula tiempo de carga
    );*/
    
    // Para usar con backend real, descomenta esto:
    return this.http.get<Proyecto[]>("http://127.0.0.1:8000/api/get_all_proyectos_data");
  }

    // Ver proyecto
  verProyecto(proyecto: Proyecto): void {
    // Guardar en sessionStorage ANTES de navegar
    sessionStorage.setItem('proyectoActual', JSON.stringify(proyecto));
    
    console.log('Guardando proyecto en sessionStorage:', proyecto);
    
    // También pasar en state por si acaso
    this.router.navigate(['./administrador/ver-proyecto'], { 
      state: { proyecto: proyecto }
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