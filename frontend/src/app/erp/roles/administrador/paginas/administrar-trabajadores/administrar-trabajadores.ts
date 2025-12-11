import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CardTranajador, Trabajador } from '../../componentes/card-tranajador/card-tranajador';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-administrar-trabajadores',
  imports: [CommonModule, HttpClientModule, CardTranajador],
  templateUrl: './administrar-trabajadores.html',
  styleUrl: './administrar-trabajadores.scss'
})
export class AdministrarTrabajadores implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Señales reactivas
  trabajadores = signal<Trabajador[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  q = signal<string>(''); // Término de búsqueda
  totalTrabajadores = 0;
  
  // Variables para el filtro por proyecto
  filtroProyectoActivo = signal<boolean>(false);
  idProyectoFiltro = signal<number | null>(null);
  nombreProyectoFiltro = signal<string>('');
  timestampProyecto = signal<string>('');

  ngOnInit(): void {
    console.log('=== ADMINISTRAR-TRABAJADORES: Componente iniciado ===');
    this.verificarFiltroProyecto();
    this.cargarTrabajadores();
  }

  // Verificar si se pasó un proyecto para filtrar - VERSIÓN ROBUSTA
  verificarFiltroProyecto(): void {
    console.log('🔍 Iniciando verificación de proyecto...');
    
    // RESETEAR todo primero
    this.resetearFiltros();
    
    // 1. PRIMERO: Intentar desde navigation state (más fresco)
    const navigation = this.router.getCurrentNavigation();
    console.log('Navigation disponible:', navigation?.extras?.state);
    
    if (navigation?.extras?.state?.['proyecto']) {
      const proyecto = navigation.extras.state['proyecto'];
      console.log('📥 Proyecto recibido en navigation state:', proyecto);
      this.establecerProyecto(proyecto, 'navigation state');
      return;
    }
    
    // 2. SEGUNDO: Intentar desde sessionStorage
    const proyectoSession = sessionStorage.getItem('proyectoParaTrabajadores');
    if (proyectoSession) {
      try {
        const proyecto = JSON.parse(proyectoSession);
        console.log('📥 Proyecto encontrado en sessionStorage:', proyecto);
        
        // Verificar si es un proyecto viejo/residual
        const ahora = new Date().getTime();
        const timestampProyecto = new Date(proyecto._timestamp || 0).getTime();
        const diferenciaMinutos = (ahora - timestampProyecto) / (1000 * 60);
        
        if (diferenciaMinutos > 5) { // Si tiene más de 5 minutos
          console.warn('⚠️ Proyecto en sessionStorage parece viejo:', diferenciaMinutos.toFixed(1), 'minutos');
          console.log('Considerando limpiar sessionStorage...');
        }
        
        this.establecerProyecto(proyecto, 'sessionStorage');
        return;
      } catch (e) {
        console.error('❌ Error parsing proyecto from sessionStorage:', e);
        sessionStorage.removeItem('proyectoParaTrabajadores');
      }
    }
    
    // 3. TERCERO: Intentar desde queryParams
    this.route.queryParams.subscribe(params => {
      console.log('Query params disponibles:', params);
      
      if (params['proyectoId']) {
        console.log('📥 Proyecto ID encontrado en query params:', params['proyectoId']);
        
        // Buscar en sessionStorage usando el ID
        const proyectoSession = sessionStorage.getItem('proyectoParaTrabajadores');
        if (proyectoSession) {
          try {
            const proyecto = JSON.parse(proyectoSession);
            if (proyecto.id_proyecto === parseInt(params['proyectoId'])) {
              this.establecerProyecto(proyecto, 'queryParams + sessionStorage');
              return;
            }
          } catch (e) {
            console.error('❌ Error matching proyecto:', e);
          }
        }
      }
      
      // 4. Si no hay proyecto, mostrar mensaje
      console.log('❌ No se encontró proyecto para filtrar en ninguna fuente');
      this.filtroProyectoActivo.set(false);
      this.totalTrabajadores = 0;
    });
  }

  // Resetear todos los filtros
  private resetearFiltros(): void {
    this.filtroProyectoActivo.set(false);
    this.idProyectoFiltro.set(null);
    this.nombreProyectoFiltro.set('');
    this.timestampProyecto.set('');
    console.log('🔄 Filtros reseteados');
  }

  // Método auxiliar para establecer proyecto
  private establecerProyecto(proyecto: any, fuente: string): void {
    const idProyecto = proyecto.id_proyecto;
    const nombreProyecto = proyecto.nombre || `Proyecto ${idProyecto}`;
    
    this.idProyectoFiltro.set(idProyecto);
    this.nombreProyectoFiltro.set(nombreProyecto);
    this.filtroProyectoActivo.set(true);
    this.timestampProyecto.set(proyecto._timestamp || new Date().toISOString());
    
    console.log(`✅ Proyecto establecido desde ${fuente}:`, {
      id: idProyecto,
      nombre: nombreProyecto,
      timestamp: this.timestampProyecto(),
      source: proyecto._source || 'desconocido'
    });
    
    // DEBUG: Verificar que no sea un proyecto residual
    if (fuente === 'sessionStorage' && !proyecto._timestamp) {
      console.warn('⚠️ Proyecto sin timestamp - podría ser residual');
    }
  }

  // Computed para filtrar automáticamente
  trabajadoresFiltrados = computed(() => {
    const termino = this.q().toLowerCase().trim();
    
    // Si no hay filtro de proyecto activo, no mostrar nada
    if (!this.filtroProyectoActivo() || !this.idProyectoFiltro()) {
      console.log('⚠️ Sin filtro de proyecto activo - Mostrando array vacío');
      return [];
    }
    
    const idProyecto = this.idProyectoFiltro()!;
    console.log(`🔍 Filtrando trabajadores para proyecto ${idProyecto}...`);
    
    // 1. Obtener todos los trabajadores
    const todosTrabajadores = this.trabajadores();
    console.log(`📊 Total trabajadores en sistema: ${todosTrabajadores.length}`);
    
    // 2. Filtrar por proyecto específico
    const trabajadoresDelProyecto = todosTrabajadores.filter(
      t => t.id_proyecto === idProyecto
    );
    
    console.log(`📊 Trabajadores del proyecto ${idProyecto}:`, trabajadoresDelProyecto.length);
    
    // DEBUG: Mostrar qué trabajadores encontramos
    if (trabajadoresDelProyecto.length > 0) {
      console.log('👥 Trabajadores encontrados:', trabajadoresDelProyecto.map(t => ({
        id: t.id_trabajador,
        puesto: t.puesto,
        activo: t.activo,
        proyecto: t.id_proyecto
      })));
    }
    
    // 3. Filtrar solo activos
    const trabajadoresActivos = trabajadoresDelProyecto.filter(t => t.activo === true);
    console.log(`📊 Trabajadores activos: ${trabajadoresActivos.length}`);
    
    // 4. Aplicar búsqueda si hay término
    if (!termino) {
      console.log(`✅ Mostrando ${trabajadoresActivos.length} trabajadores activos`);
      return trabajadoresActivos;
    }
    
    const resultadoBusqueda = trabajadoresActivos.filter(t =>
      t.puesto.toLowerCase().includes(termino) ||
      t.contrato.toLowerCase().includes(termino)
    );
    
    console.log(`🔍 Búsqueda "${termino}": ${resultadoBusqueda.length} resultados`);
    return resultadoBusqueda;
  });

  // Computed para estadísticas
  trabajadoresActivosCount = computed(() => {
    return this.trabajadoresFiltrados().length;
  });

  trabajadoresInactivosCount = computed(() => {
    if (this.filtroProyectoActivo() && this.idProyectoFiltro()) {
      const idProyecto = this.idProyectoFiltro()!;
      const inactivos = this.trabajadores().filter(t => 
        t.id_proyecto === idProyecto && !t.activo
      ).length;
      console.log(`📊 Trabajadores inactivos en proyecto ${idProyecto}: ${inactivos}`);
      return inactivos;
    }
    return 0;
  });

  presupuestoTotal = computed(() => {
    const total = this.trabajadoresFiltrados()
      .reduce((sum, t) => sum + t.salario, 0);
    console.log(`💰 Presupuesto total activos: $${total}`);
    return total;
  });

  // Cargar trabajadores
  cargarTrabajadores(): void {
    this.obtenerTrabajadores().subscribe({
      next: (trabajadores) => {
        this.trabajadores.set(trabajadores);
        console.log(`✅ ${trabajadores.length} trabajadores cargados`);
        
        // Calcular estadísticas si hay filtro activo
        if (this.filtroProyectoActivo() && this.idProyectoFiltro()) {
          const idProyecto = this.idProyectoFiltro()!;
          const trabajadoresProyecto = trabajadores.filter(t => t.id_proyecto === idProyecto);
          const trabajadoresActivosProyecto = trabajadoresProyecto.filter(t => t.activo);
          
          this.totalTrabajadores = trabajadoresActivosProyecto.length;
          
          console.log(`📈 Estadísticas finales proyecto ${idProyecto}:`, {
            totalTrabajadores: trabajadoresProyecto.length,
            activos: trabajadoresActivosProyecto.length,
            inactivos: trabajadoresProyecto.filter(t => !t.activo).length,
            presupuestoTotal: trabajadoresActivosProyecto.reduce((sum, t) => sum + t.salario, 0)
          });
        } else {
          this.totalTrabajadores = 0;
          console.log('⚠️ Sin proyecto seleccionado - Estadísticas en 0');
        }
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error al cargar trabajadores:', err);
        this.error.set('Error al cargar los trabajadores');
        this.loading.set(false);
        
        // Usar datos simulados en caso de error
        this.trabajadores.set(this.trabajadoresSimulados);
        
        if (this.filtroProyectoActivo() && this.idProyectoFiltro()) {
          const idProyecto = this.idProyectoFiltro()!;
          const trabajadoresProyecto = this.trabajadoresSimulados.filter(t => t.id_proyecto === idProyecto);
          const trabajadoresActivosProyecto = trabajadoresProyecto.filter(t => t.activo);
          
          this.totalTrabajadores = trabajadoresActivosProyecto.length;
          
          console.log('📊 Usando datos simulados para proyecto', idProyecto, {
            total: trabajadoresProyecto.length,
            activos: trabajadoresActivosProyecto.length,
            inactivos: trabajadoresProyecto.filter(t => !t.activo).length
          });
        } else {
          this.totalTrabajadores = 0;
        }
        
        this.loading.set(false);
      }
    });
  }

  obtenerTrabajadores(): Observable<Trabajador[]> {
    return of(this.trabajadoresSimulados).pipe(
      delay(1000)
    );
  }

  // Limpiar filtro y volver a proyectos
  limpiarFiltroProyecto(): void {
    console.log('🔄 Limpiando filtro y volviendo a proyectos...');
    
    // Limpiar completamente sessionStorage
    sessionStorage.removeItem('proyectoParaTrabajadores');
    sessionStorage.removeItem('proyectoActual');
    sessionStorage.removeItem('proyectoParaRegistro');
    
    this.router.navigate(['/administrador/administrar-proyectos']);
  }

  // Ver detalle de trabajador
  verTrabajador(trabajador: Trabajador): void {
    console.log('👁️ Ver trabajador:', trabajador.id_trabajador, trabajador.puesto);
    
    // Guardar trabajador y mantener contexto del proyecto
    sessionStorage.setItem('trabajadorActual', JSON.stringify(trabajador));
    
    if (this.filtroProyectoActivo() && this.idProyectoFiltro()) {
      const proyectoContexto = {
        id_proyecto: this.idProyectoFiltro(),
        nombre: this.nombreProyectoFiltro()
      };
      sessionStorage.setItem('proyectoActualContexto', JSON.stringify(proyectoContexto));
    }
    
    this.router.navigate(['./administrador/ver-trabajador'], { 
      queryParams: { trabajador: JSON.stringify(trabajador) }
    });
  }

  // Navegar a registrar nuevo trabajador
  irARegistrar(): void {
    if (this.filtroProyectoActivo() && this.idProyectoFiltro()) {
      const proyecto = {
        id_proyecto: this.idProyectoFiltro(),
        nombre: this.nombreProyectoFiltro(),
        _timestamp: new Date().toISOString(),
        _source: 'administrar-trabajadores'
      };
      
      sessionStorage.setItem('proyectoParaRegistro', JSON.stringify(proyecto));
      
      console.log('📝 Navegando a registro con proyecto:', proyecto);
      
      this.router.navigate(['./administrador/registrar-contratos-trabajadores'], {
        state: { proyecto: proyecto }
      });
    } else {
      console.log('⚠️ Sin proyecto seleccionado - Navegando a registro sin contexto');
      this.router.navigate(['./administrador/registrar-contratos-trabajadores']);
    }
  }

  // Datos de prueba simulados
  private trabajadoresSimulados: Trabajador[] = [
    {
      id_trabajador: 1,
      fecha_inicio: '2023-03-15',
      fecha_fin: '2024-12-31',
      puesto: 'Ingeniero Civil',
      salario: 45000,
      contrato: 'Tiempo completo',
      activo: true,
      id_proyecto: 1
    },
    {
      id_trabajador: 2,
      fecha_inicio: '2024-01-10',
      fecha_fin: '2024-06-30',
      puesto: 'Arquitecto',
      salario: 38000,
      contrato: 'Por proyecto',
      activo: true,
      id_proyecto: 1
    },
    {
      id_trabajador: 3,
      fecha_inicio: '2023-11-01',
      fecha_fin: '2025-11-01',
      puesto: 'Supervisor de Obras',
      salario: 52000,
      contrato: 'Indefinido',
      activo: true,
      id_proyecto: 4
    },
    {
      id_trabajador: 4,
      fecha_inicio: '2024-02-01',
      fecha_fin: '2024-08-31',
      puesto: 'Electricista',
      salario: 28000,
      contrato: 'Temporal',
      activo: true,
      id_proyecto: 2
    },
    {
      id_trabajador: 5,
      fecha_inicio: '2023-09-15',
      fecha_fin: '2024-03-15',
      puesto: 'Jardinero',
      salario: 22000,
      contrato: 'Por temporada',
      activo: false,
      id_proyecto: 3
    },
    {
      id_trabajador: 6,
      fecha_inicio: '2024-03-01',
      fecha_fin: '2024-09-30',
      puesto: 'Coordinador Médico',
      salario: 35000,
      contrato: 'Por proyecto',
      activo: true,
      id_proyecto: 5
    },
    {
      id_trabajador: 7,
      fecha_inicio: '2023-10-10',
      fecha_fin: '2024-02-29',
      puesto: 'Instalador Techos',
      salario: 25000,
      contrato: 'Temporal',
      activo: false,
      id_proyecto: 6
    },
    {
      id_trabajador: 8,
      fecha_inicio: '2024-01-20',
      fecha_fin: '2024-10-31',
      puesto: 'Gerente de Proyecto',
      salario: 60000,
      contrato: 'Tiempo completo',
      activo: true,
      id_proyecto: 4
    },
    {
      id_trabajador: 9,
      fecha_inicio: '2024-04-01',
      fecha_fin: '2024-12-31',
      puesto: 'Enfermero',
      salario: 30000,
      contrato: 'Por proyecto',
      activo: true,
      id_proyecto: 5
    },
    {
      id_trabajador: 10,
      fecha_inicio: '2023-08-01',
      fecha_fin: '2024-08-01',
      puesto: 'Administrador',
      salario: 32000,
      contrato: 'Anual',
      activo: true,
      id_proyecto: 1
    },
    {
      id_trabajador: 11,
      fecha_inicio: '2024-02-15',
      fecha_fin: '2024-07-15',
      puesto: 'Asistente Técnico',
      salario: 24000,
      contrato: 'Temporal',
      activo: true,
      id_proyecto: 2
    },
    {
      id_trabajador: 12,
      fecha_inicio: '2023-12-01',
      fecha_fin: '2024-05-31',
      puesto: 'Ecólogo',
      salario: 34000,
      contrato: 'Por proyecto',
      activo: false,
      id_proyecto: 3
    }
  ];
}