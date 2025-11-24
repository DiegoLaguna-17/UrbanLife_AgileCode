import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CardProyectoContabilidad } from '../../componentes/card-proyecto-contabilidad/card-proyecto-contabilidad';
import { CardMovimiento } from '../../componentes/card-movimiento/card-movimiento';
import { ContabilidadProyecto, Movimiento, PresupuestoProyecto, CapitalProyecto } from '../../componentes/interfaces';

@Component({
  selector: 'app-administrar-presupuestos-proyectos',
  imports: [CommonModule, HttpClientModule, CardProyectoContabilidad, CardMovimiento],
  templateUrl: './administrar-presupuestos-proyectos.html',
  styleUrl: './administrar-presupuestos-proyectos.scss'
})
export class AdministrarPresupuestosProyectos implements OnInit {
  private http = inject(HttpClient);

  // Señales para estado de la aplicación
  vistaActual = signal<'proyectos' | 'movimientos'>('proyectos');
  loading = signal<boolean>(true);
  error = signal<string>('');
  q = signal<string>(''); // Búsqueda por nombre de proyecto
  fechaFiltro = signal<string>(''); // Filtro por fecha para movimientos

  // Datos
  proyectos = signal<ContabilidadProyecto[]>([]);
  proyectosC=signal<PresupuestoProyecto[]>([]);
  proyectoSeleccionado = signal<ContabilidadProyecto | null>(null);
  movimientoSeleccionado = signal<Movimiento | null>(null);
  capitalProyecto = signal<CapitalProyecto | null>(null);

  // Modales
  mostrarModalMovimiento = signal<boolean>(false);
  mostrarModalCapital = signal<boolean>(false);

  // Computed values
  proyectosFiltrados = computed(() => {
    const termino = this.q().toLowerCase().trim();
    if (!termino) return this.proyectos();
    return this.proyectos().filter(p =>
      p.nombre_proyecto.toLowerCase().includes(termino)
    );
  });

  movimientosFiltrados = computed(() => {
    const movimientos = this.proyectoSeleccionado()?.movimientos || [];
    const fechaSeleccionada = this.fechaFiltro();
    
    if (!fechaSeleccionada) return movimientos;

    return movimientos.filter(movimiento => {
      const fechaMovimiento = new Date(movimiento.fecha).toDateString();
      const fechaFiltro = new Date(fechaSeleccionada).toDateString();
      return fechaMovimiento === fechaFiltro;
    });
  });

  // DATOS DE PRUEBA
  private datosDePrueba: ContabilidadProyecto[] = [
  ];

  // Cargar proyectos
  cargarProyectos() {
    this.loading.set(true);
    this.error.set('');
    
    setTimeout(() => {
      try {
        this.proyectos.set(this.datosDePrueba);
        this.loading.set(false);
      } catch (err) {
        console.error('Error al cargar proyectos:', err);
        this.error.set('Error al cargar los proyectos. Por favor, intenta nuevamente.');
        this.loading.set(false);
      }
    }, 1000);

    // ⚠️ CÓDIGO PARA ENDPOINT REAL:
    
    this.http.get<ContabilidadProyecto[]>('http://127.0.0.1:8000/api/get_movimientos_proyectos').subscribe({
      next: (proyectos) => {
        this.proyectos.set(proyectos);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
        this.error.set('Error al cargar los proyectos. Por favor, intenta nuevamente.');
        this.loading.set(false);
      }
    });

    this.http.get<PresupuestoProyecto[]>(`http://127.0.0.1:8000/api/get_movimientos_presupuesto`).subscribe({
      next: (presupuesto) => {
        this.proyectosC.set(presupuesto);

        console.log(presupuesto)
        /*
        
        */
      },
      error: (error) => {
        console.error('Error al cargar presupuesto:', error);
        alert('Error al cargar el capital del proyecto');
      }
    });
    
  }

  // Ver proyecto - Cambia a vista de movimientos
  verProyecto(proyecto: ContabilidadProyecto) {
    this.proyectoSeleccionado.set(proyecto);
    this.vistaActual.set('movimientos');
    this.fechaFiltro.set(''); // Resetear filtro de fecha
  }

  // Volver a vista de proyectos
  volverAProyectos() {
    this.vistaActual.set('proyectos');
    this.proyectoSeleccionado.set(null);
    this.fechaFiltro.set('');
  }

  // Ver detalles de movimiento
  verMovimiento(movimiento: Movimiento) {
    this.movimientoSeleccionado.set(movimiento);
    this.mostrarModalMovimiento.set(true);
  }

  // Ver capital del proyecto
  verCapitalProyecto() {
    const proyecto = this.proyectoSeleccionado();
    if (!proyecto) return;
    const presupuesto: PresupuestoProyecto = this.proyectosC()
  .find(p => p.id_proyecto === proyecto.id_proyecto)!;
    const capital = this.calcularCapital(presupuesto);
        this.capitalProyecto.set(capital);
        this.mostrarModalCapital.set(true);

    
  }

  // Simular carga de presupuesto (datos de prueba)
  private async simularCargaPresupuesto(idProyecto: number): Promise<CapitalProyecto> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Datos de prueba para presupuesto
        const datosPresupuesto: { [key: number]: PresupuestoProyecto } = {
        };

        const presupuesto = datosPresupuesto[idProyecto] || {
          id_proyecto: idProyecto,
          id_contabilidad: 1,
          presupuesto: 0,
          movimientos: []
        };

        resolve(this.calcularCapital(presupuesto));
      }, 500);
    });
  }

  // Calcular capital del proyecto
  private calcularCapital(presupuesto: PresupuestoProyecto): CapitalProyecto {
  const ingresos_totales = presupuesto.movimientos
    .filter(m => m.movimiento === 'ingreso')
    .reduce((sum, m) => sum + Number(m.monto), 0);

  const egresos_totales = presupuesto.movimientos
    .filter(m => m.movimiento === 'egreso')
    .reduce((sum, m) => sum + Number(m.monto), 0);

  const presupuesto_actual =
    Number(presupuesto.presupuesto) + (ingresos_totales - egresos_totales);

  return {
    ingresos_totales,
    egresos_totales,
    presupuesto_actual
  };
}


  // Métodos de utilidad
  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
  }

  // Métodos para cerrar modales
  cerrarModalMovimiento() {
    this.mostrarModalMovimiento.set(false);
    this.movimientoSeleccionado.set(null);
  }

  cerrarModalCapital() {
    this.mostrarModalCapital.set(false);
    this.capitalProyecto.set(null);
  }

  limpiarFiltroFecha() {
    this.fechaFiltro.set('');
  }

  ngOnInit() {
    this.cargarProyectos();
  }
}