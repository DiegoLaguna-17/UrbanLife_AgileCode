import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardPedido, Pedido, Materiales } from '../../componentes/card-pedido/card-pedido';
import { map, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-administrar-pedidos',
  imports: [CommonModule, HttpClientModule, CardPedido, FormsModule],
  templateUrl: './administrar-pedidos.html',
  styleUrl: './administrar-pedidos.scss'
})
export class AdministrarPedidos implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Señales reactivas
  pedidos = signal<Pedido[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  fechaFiltro = signal<string>('');
  estadosFiltro = signal<string[]>(['pendiente', 'aceptado', 'rechazado', 'transito', 'recibido']);

  // Variables para modales
  pedidoSeleccionado: Pedido | null = null;
  mostrarModalPendiente = false;
  mostrarModalAceptado = false;
  mostrarModalRechazado = false;
  mostrarModalTransito = false;
  mostrarModalRecibido = false;
  mostrarModalFechaLlegada = false;
  mostrarModalConfirmarFecha = false;
  fechaLlegadaEstimada = '';
  fechaHoy = new Date().toISOString().split('T')[0];

  // Computed para filtrar automáticamente
  pedidosFiltrados = computed(() => {
    const fecha = this.fechaFiltro();
    const estados = this.estadosFiltro();
    
    let pedidosFiltrados = this.pedidos();

    // Filtrar por fecha si hay una seleccionada
    if (fecha) {
      pedidosFiltrados = pedidosFiltrados.filter(p => 
        p.fecha_solicitud === fecha
      );
    }

    // Filtrar por estados seleccionados
    if (estados.length > 0) {
      pedidosFiltrados = pedidosFiltrados.filter(p => 
        estados.includes(p.estado)
      );
    }

    return pedidosFiltrados;
  });

  // Datos de prueba simulados
  private pedidosSimulados: Pedido[] = [
    {
      id_pedido: 1,
      id_proveedor: 1,
      nombre_proveedor: "Soboce",
      fecha_solicitud: "2024-01-15",
      fecha_llegada_estimada: "",
      fecha_llegada_real: "",
      estado: "pendiente",
      mensaje: "",
      monto: 1500,
      materiales: [
        { material: "ladrillos", cantidad: 1000 },
        { material: "cemento", cantidad: 50 }
      ]
    },
    {
      id_pedido: 2,
      id_proveedor: 2,
      nombre_proveedor: "Cemento Viacha",
      fecha_solicitud: "2024-01-10",
      fecha_llegada_estimada: "2024-01-25",
      fecha_llegada_real: "",
      estado: "aceptado",
      mensaje: "",
      monto: 2000,
      materiales: [
        { material: "cemento especial", cantidad: 100 },
        { material: "cal", cantidad: 200 }
      ]
    },
    {
      id_pedido: 3,
      id_proveedor: 3,
      nombre_proveedor: "Hierros Bolivia",
      fecha_solicitud: "2024-01-05",
      fecha_llegada_estimada: "",
      fecha_llegada_real: "",
      estado: "rechazado",
      mensaje: "No tenemos stock disponible de los materiales solicitados",
      monto: 3000,
      materiales: [
        { material: "varilla corrugada 1/2", cantidad: 500 },
        { material: "alambre negro", cantidad: 1000 }
      ]
    },
    {
      id_pedido: 4,
      id_proveedor: 4,
      nombre_proveedor: "Maderas del Oriente",
      fecha_solicitud: "2024-01-12",
      fecha_llegada_estimada: "2024-01-30",
      fecha_llegada_real: "",
      estado: "transito",
      mensaje: "",
      monto: 1800,
      materiales: [
        { material: "madera pino", cantidad: 200 },
        { material: "triplay", cantidad: 100 }
      ]
    },
    {
      id_pedido: 5,
      id_proveedor: 1,
      nombre_proveedor: "Soboce",
      fecha_solicitud: "2024-01-08",
      fecha_llegada_estimada: "2024-01-20",
      fecha_llegada_real: "2024-01-19",
      estado: "recibido",
      mensaje: "",
      monto: 2200,
      materiales: [
        { 
          material: "arena", 
          cantidad: 5000,
          cantidadRecibida: 4800 // ← AHORA SÍ RECONOCE ESTA PROPIEDAD
        },
        { 
          material: "grava", 
          cantidad: 3000,
          cantidadRecibida: 3000 // ← AHORA SÍ RECONOCE ESTA PROPIEDAD
        }
      ]
    }
  ];

  // Cargar pedidos - Versión con datos de prueba
  cargarPedidos() {
    this.obtenerPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos.set(pedidos);
        console.log("Pedidos cargados:", this.pedidos());
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al obtener pedidos:', error);
        this.error.set('Error al cargar los pedidos');
        this.loading.set(false);
      }
    });
  }

  obtenerPedidos(): Observable<Pedido[]> {
    // Simulamos una llamada HTTP
    return of(this.pedidosSimulados).pipe(delay(1000));
    
    // Para usar con backend real
    /*
    return this.http.get<any[]>("http://127.0.0.1:8000/api/get_all_pedidos").pipe(
      map(response =>
        response.map(item => ({
          id_pedido: item.id_pedido,
          id_proveedor: item.id_proveedor,
          nombre_proveedor: item.nombre_proveedor,
          fecha_solicitud: item.fecha_solicitud,
          fecha_llegada_estimada: item.fecha_llegada_estimada,
          fecha_llegada_real: item.fecha_llegada_real,
          estado: item.estado,
          mensaje: item.mensaje,
          monto: item.monto,
          materiales: item.materiales
        }))
      )
    );
    */
  }

  // Toggle para filtros de estado
  toggleEstadoFiltro(estado: string) {
    const estadosActuales = this.estadosFiltro();
    if (estadosActuales.includes(estado)) {
      this.estadosFiltro.set(estadosActuales.filter(e => e !== estado));
    } else {
      this.estadosFiltro.set([...estadosActuales, estado]);
    }
  }

  // Ver pedido - abre modal según estado
  verPedido(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
    
    switch(pedido.estado) {
      case 'pendiente':
        this.mostrarModalPendiente = true;
        break;
      case 'aceptado':
        this.mostrarModalAceptado = true;
        break;
      case 'rechazado':
        this.mostrarModalRechazado = true;
        break;
      case 'transito':
        this.mostrarModalTransito = true;
        break;
      case 'recibido':
        this.mostrarModalRecibido = true;
        break;
    }
  }

  // Calcular costo total
  calcularCostoTotal(): number {
    return this.pedidoSeleccionado?.monto || 0;
  }

  // Calcular días faltantes
  calcularDiasFaltantes(): number {
    if (!this.pedidoSeleccionado?.fecha_llegada_estimada) return 0;
    
    const fechaEstimada = new Date(this.pedidoSeleccionado.fecha_llegada_estimada);
    const fechaHoy = new Date();
    const diferenciaMs = fechaEstimada.getTime() - fechaHoy.getTime();
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  }

  // Mostrar modal para fecha de llegada
  abrirModalFechaLlegada() {
    this.mostrarModalAceptado = false;
    this.mostrarModalFechaLlegada = true;
    this.fechaLlegadaEstimada = '';
  }

  // Cerrar modal de fecha de llegada
  cerrarModalFechaLlegada() {
    this.mostrarModalFechaLlegada = false;
    this.mostrarModalAceptado = true;
  }

  // Mostrar modal de confirmación de fecha
  abrirModalConfirmarFecha() {
    this.mostrarModalFechaLlegada = false;
    this.mostrarModalConfirmarFecha = true;
  }

  // Cerrar modal de confirmación de fecha
  cerrarModalConfirmarFecha() {
    this.mostrarModalConfirmarFecha = false;
    this.mostrarModalFechaLlegada = true;
  }

  // Confirmar fecha de llegada
  confirmarFechaLlegada() {
    if (this.pedidoSeleccionado && this.fechaLlegadaEstimada) {
      // Aquí iría la llamada al backend para actualizar el pedido
      console.log('Actualizando pedido:', this.pedidoSeleccionado.id_pedido, 'con fecha:', this.fechaLlegadaEstimada);
      
      // Simulamos la actualización
      const pedidosActualizados = this.pedidos().map(pedido => 
        pedido.id_pedido === this.pedidoSeleccionado!.id_pedido 
          ? { 
              ...pedido, 
              fecha_llegada_estimada: this.fechaLlegadaEstimada,
              estado: 'transito'
            }
          : pedido
      );
      
      this.pedidos.set(pedidosActualizados);
      
      // Cerrar modales
      this.cerrarModalConfirmarFecha();
      this.cerrarModal();
    }
  }

  // Calcular total solicitado
  calcularTotalSolicitado(): number {
    if (!this.pedidoSeleccionado?.materiales) return 0;
    return this.pedidoSeleccionado.materiales.reduce((total, material) => total + material.cantidad, 0);
  }

  // Calcular total recibido
  calcularTotalRecibido(): number {
    if (!this.pedidoSeleccionado?.materiales) return 0;
    return this.pedidoSeleccionado.materiales.reduce((total, material) => 
      total + (material.cantidadRecibida !== undefined ? material.cantidadRecibida : material.cantidad), 0
    );
  }

  // Calcular faltante por material
  calcularFaltante(material: Materiales): number {
    const recibido = material.cantidadRecibida !== undefined ? material.cantidadRecibida : material.cantidad;
    return Math.max(0, material.cantidad - recibido); // Siempre positivo o cero
  }

  // Calcular total faltante
  calcularTotalFaltante(): number {
    if (!this.pedidoSeleccionado?.materiales) return 0;
    return this.pedidoSeleccionado.materiales.reduce((total, material) => 
      total + this.calcularFaltante(material), 0
    );
  }

  // Ir a recibir pedido
  irARecibirPedido() {
    if (this.pedidoSeleccionado) {
      // Convertir el pedido a string para pasarlo por queryParams
      const pedidoString = JSON.stringify(this.pedidoSeleccionado);
      
      this.router.navigate(['./administrador/recibir-pedido'], { 
        queryParams: { pedido: pedidoString },
        state: { pedido: this.pedidoSeleccionado } // También por state por si acaso
      });
    }
  }

  // Cerrar todos los modales
  cerrarModal() {
    this.mostrarModalPendiente = false;
    this.mostrarModalAceptado = false;
    this.mostrarModalRechazado = false;
    this.mostrarModalTransito = false;
    this.mostrarModalRecibido = false;
    this.mostrarModalFechaLlegada = false;
    this.mostrarModalConfirmarFecha = false;
    this.pedidoSeleccionado = null;
  }

  // Navegar a la página de registrar pedido
  irARegistrar() {
    this.router.navigate(['./administrador/registrar-pedidos']);
  }

  ngOnInit() {
    this.cargarPedidos();
  }
}
