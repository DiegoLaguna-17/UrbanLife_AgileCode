import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Proyecto } from '../../componentes/card-proyecto/card-proyecto';

@Component({
  selector: 'app-ver-proyecto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-proyectos.html',
  styleUrl: './ver-proyectos.scss'
})
export class VerProyectos implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Variables del componente
  proyecto: Proyecto | null = null;
  mostrarError = false;
  mensajeError = '';

  ngOnInit(): void {
    this.cargarProyecto();
  }

  // Cargar proyecto - VERSIÓN SIMPLIFICADA Y CONFiable
  private cargarProyecto(): void {
    console.log('=== VER-PROYECTO: Iniciando carga ===');
    
    // 1. LIMPIAR datos viejos de trabajadores (IMPORTANTE)
    sessionStorage.removeItem('proyectoParaTrabajadores');
    
    // 2. Verificar si viene en el estado de la navegación (lo más directo)
    const navigation = this.router.getCurrentNavigation();
    console.log('Navigation state:', navigation?.extras?.state);
    
    if (navigation?.extras?.state?.['proyecto']) {
      this.proyecto = navigation.extras.state['proyecto'];
      console.log('✅ Proyecto cargado desde navigation state:', this.proyecto);
      
      // Guardar SOLO para referencia, no para trabajadores todavía
      sessionStorage.setItem('proyectoActual', JSON.stringify(this.proyecto));
      return;
    }
    
    // 3. Si no, verificar history.state
    console.log('History state:', window.history.state);
    if (window.history.state && window.history.state.proyecto) {
      this.proyecto = window.history.state.proyecto;
      console.log('✅ Proyecto cargado desde history.state:', this.proyecto);
      
      sessionStorage.setItem('proyectoActual', JSON.stringify(this.proyecto));
      return;
    }
    
    // 4. Si no, verificar queryParams (último recurso)
    this.route.queryParams.subscribe(params => {
      console.log('Query params:', params);
      
      const proyectoParam = params['proyecto'];
      if (proyectoParam) {
        try {
          this.proyecto = JSON.parse(proyectoParam);
          console.log('✅ Proyecto cargado desde query params:', this.proyecto);
          
          sessionStorage.setItem('proyectoActual', JSON.stringify(this.proyecto));
          return;
        } catch (e) {
          console.error('❌ Error parsing proyecto:', e);
        }
      }

      // 5. Si no se encuentra, mostrar error
      this.mensajeError = 'No se encontró información del proyecto.';
      this.mostrarError = true;
      console.error('❌ No se pudo cargar el proyecto de ninguna fuente');
    });
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
    this.router.navigate(['./jefeobra/administrar-proyectos']);
  }

  verDocumentacion(): void {
    if (this.proyecto) {
      console.log('📍 Navegando a documentación con proyecto:', this.proyecto);
      sessionStorage.setItem('proyectoParaDocumentacion', JSON.stringify(this.proyecto));
      this.router.navigate(['/jefeobra/ver-documentacion'], {
        state: { proyecto: this.proyecto }
      });
    }
  }

  verActividades(): void {
    if (this.proyecto) {
      console.log('📍 Navegando a actividades con proyecto:', this.proyecto);
      sessionStorage.setItem('proyectoParaActividades', JSON.stringify(this.proyecto));
      this.router.navigate(['./jefeobra/ver-actividades'], {
        state: { proyecto: this.proyecto }
      });
    }
  }

  // Navegación a trabajadores - MÉTODO CORREGIDO
  verTrabajadores(): void {
    if (this.proyecto) {
      console.log('📍 Navegando a trabajadores con proyecto:', this.proyecto);
      
      // 1. LIMPIAR cualquier proyecto viejo (CRÍTICO)
      sessionStorage.removeItem('proyectoParaTrabajadores');
      
      // 2. Guardar el proyecto ACTUAL con timestamp para debug
      const proyectoConTimestamp = {
        ...this.proyecto,
        _timestamp: new Date().toISOString(),
        _source: 'ver-proyecto'
      };
      
      sessionStorage.setItem('proyectoParaTrabajadores', JSON.stringify(proyectoConTimestamp));
      
      console.log('📦 Proyecto guardado en sessionStorage:', proyectoConTimestamp);
      
      // 3. Limpiar otros datos viejos
      sessionStorage.removeItem('proyectoParaRegistro');
      
      // 4. Navegar con state Y queryParams para doble seguridad
      this.router.navigate(['/jefeobra/administrar-trabajadores'], {
        state: { proyecto: this.proyecto },
        queryParams: { 
          proyectoId: this.proyecto.id_proyecto,
          timestamp: new Date().getTime()
        }
      });
    } else {
      console.error('❌ No hay proyecto para navegar a trabajadores');
      this.mensajeError = 'No hay información del proyecto para ver trabajadores.';
      this.mostrarError = true;
    }
  }

  // Cerrar modal de error
  cerrarModalError(): void {
    this.mostrarError = false;
    this.volver();
  }
}