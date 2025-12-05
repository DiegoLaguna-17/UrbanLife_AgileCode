import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardPedido, Pedido, Materiales } from '../../componentes/card-pedido/card-pedido';
import { Chart, ArcElement, registerables, Tooltip, Legend } from 'chart.js';

@Component({
  selector: 'app-administrar-pedidos',
  imports: [CommonModule, HttpClientModule, CardPedido, FormsModule],
  templateUrl: './administrar-pedidos.html',
  styleUrl: './administrar-pedidos.scss'
})
export class AdministrarPedidos implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  constructor() {
    Chart.register(...registerables);
  }
  
  pedidos = signal<Pedido[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  fechaFiltro = signal<string>('');
  estadosFiltro = signal<string[]>([]);
  
  totalTransito: any = 0;
  totalRecibidos: any = 0;
  totalRechazados: any = 0;
  totalPendiente: any = 0;
  totalAceptados: any = 0;
  
  pedidoSeleccionado: Pedido | null = null;
  mostrarModalPendiente = false;
  mostrarModalAceptado = false;
  mostrarModalRechazado = false;
  mostrarModalTransito = false;
  mostrarModalRecibido = false;
  mostrarModalFechaLlegada = false;
  mostrarModalConfirmarFecha = false;
  mostrarModalGrafica = false;
  fechaLlegadaEstimada = '';
  fechaHoy = new Date().toISOString().split('T')[0];

  pedidosFiltrados = computed(() => {
    const fecha = this.fechaFiltro();
    const estados = this.estadosFiltro();
    
    let pedidosFiltrados = this.pedidos();

    if (fecha) {
      pedidosFiltrados = pedidosFiltrados.filter(p => 
        p.fecha_solicitud === fecha
      );
    }

    if (estados.length > 0) {
      pedidosFiltrados = pedidosFiltrados.filter(p => 
        estados.includes(p.estado)
      );
    }

    return pedidosFiltrados;
  });

  cargarPedidos() {
    this.obtenerPedidos();
  }

  obtenerPedidos() {
    const url = `http://127.0.0.1:8000/api/get_all_pedidos`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        response.data.forEach((p: any) => {
          if (p.estado == "rechazado") {
            this.totalRechazados++;
          } else if (p.estado == "recibido") {
            this.totalRecibidos++;
          } else if (p.estado == "transito") {
            this.totalTransito++;
          } else if (p.estado == "pendiente") {
            this.totalPendiente++;
          } else {
            this.totalAceptados++;
          }
        });
        
        this.pedidos.set(response.data);
        console.log('Pedidos cargados');
        console.log(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.log('Error al cargar pedidos ', err);
        this.loading.set(false);
      }
    });
  }
  
  mostrarGrafica() {
    this.mostrarModalGrafica = true;
    // Esperamos un poco para que el modal se renderice antes de crear el gráfico
    setTimeout(() => {
      this.loadPieChartModal();
    }, 100);
  }

  cerrarModalGrafica() {
    this.mostrarModalGrafica = false;
  }

  loadPieChartModal() {
    const recibidos = this.totalRecibidos;
    const transito = this.totalTransito;
    const rechazados = this.totalRechazados;
    const aceptados = this.totalAceptados;
    const pendientes = this.totalPendiente;

    const canvas = document.getElementById('estadoPedidosModal') as HTMLCanvasElement;
    if (!canvas) {
      console.error('No se encontró el elemento canvas para el modal');
      return;
    }

    // Destruir gráfico anterior si existe
    const chartExist = Chart.getChart(canvas);
    if (chartExist) {
      chartExist.destroy();
    }

    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Recibidos', 'En Tránsito', 'Rechazados', 'Aceptados', 'Pendientes'],
        datasets: [{
          data: [recibidos, transito, rechazados, aceptados, pendientes],
          backgroundColor: ['#4CAF50', '#2196F3', '#F44336', '#9C27B0', '#FF9800']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'bottom',
            labels: {
              font: {
                size: 14
              },
              padding: 20
            }
          },
          title: {
            display: true,
            text: 'Distribución de Estados de Pedidos',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: 20
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw as number;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  obtenerDash() {
    const url = "http://127.0.0.1:8000/api/dashboard_data";
    this.http.get(url).subscribe({
      next: (response: any) => {
        this.totalRechazados = response.totalRechazados;
        this.totalRecibidos = response.totalRecibidos;
        this.totalTransito = response.totalTransito;
        console.log('Total rechazados ', this.totalRechazados);
        console.log('Total recibidos ', this.totalRecibidos);
        console.log('Total en transito ', this.totalTransito);
      },
      error: (err) => {
        console.log('Error al obtener datos de dashboard ', err.error);
      }
    });
  }

  toggleEstadoFiltro(estado: string) {
    const estadosActuales = this.estadosFiltro();
    if (estadosActuales.includes(estado)) {
      this.estadosFiltro.set(estadosActuales.filter(e => e !== estado));
    } else {
      this.estadosFiltro.set([...estadosActuales, estado]);
    }
  }

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

  calcularCostoTotal(): number {
    return this.pedidoSeleccionado?.monto || 0;
  }

  calcularDiasFaltantes(): number {
    if (!this.pedidoSeleccionado?.fecha_llegada_estimada) return 0;
    
    const fechaEstimada = new Date(this.pedidoSeleccionado.fecha_llegada_estimada);
    const fechaHoy = new Date();
    const diferenciaMs = fechaEstimada.getTime() - fechaHoy.getTime();
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  }

  abrirModalFechaLlegada() {
    this.mostrarModalAceptado = false;
    this.mostrarModalFechaLlegada = true;
    this.fechaLlegadaEstimada = '';
  }

  cerrarModalFechaLlegada() {
    this.mostrarModalFechaLlegada = false;
    this.mostrarModalAceptado = true;
  }

  abrirModalConfirmarFecha() {
    this.mostrarModalFechaLlegada = false;
    this.mostrarModalConfirmarFecha = true;
  }

  cerrarModalConfirmarFecha() {
    this.mostrarModalConfirmarFecha = false;
    this.mostrarModalFechaLlegada = true;
  }

  confirmarFechaLlegada() {
    if (this.pedidoSeleccionado && this.fechaLlegadaEstimada) {
      console.log('Actualizando pedido:', this.pedidoSeleccionado.id_pedido, 'con fecha:', this.fechaLlegadaEstimada);
      
      const url = `http://127.0.0.1:8000/api/cambiar_transito`;
      const body = {
        id_pedido: this.pedidoSeleccionado.id_pedido,
        fecha_llegada_estimada: this.fechaLlegadaEstimada,
        estado: 'transito',
      };

      this.http.put(url, body).subscribe({
        next: (response) => {
          console.log('Pedido actualizado transito');
          
          // Actualizamos el estado localmente
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
          
          // Actualizamos contadores
          this.totalTransito++;
          this.totalAceptados--;
          
          // Cerrar modales
          this.cerrarModalConfirmarFecha();
          this.cerrarModal();
        },
        error: (err) => {
          console.log('Error al actualizar pedido transito');
        } 
      });
    }
  }

  calcularTotalSolicitado(): number {
    if (!this.pedidoSeleccionado?.materiales) return 0;
    return this.pedidoSeleccionado.materiales.reduce((total, material) => total + material.cantidad, 0);
  }

  calcularTotalRecibido(): number {
    if (!this.pedidoSeleccionado?.materiales) return 0;
    return this.pedidoSeleccionado.materiales.reduce((total, material) => 
      total + (material.cantidadRecibida !== undefined ? material.cantidadRecibida : material.cantidad), 0
    );
  }

  calcularFaltante(material: Materiales): number {
    const recibido = material.cantidadRecibida !== undefined ? material.cantidadRecibida : material.cantidad;
    return Math.max(0, material.cantidad - recibido);
  }

  calcularTotalFaltante(): number {
    if (!this.pedidoSeleccionado?.materiales) return 0;
    return this.pedidoSeleccionado.materiales.reduce((total, material) => 
      total + this.calcularFaltante(material), 0
    );
  }

  irARecibirPedido() {
    if (this.pedidoSeleccionado) {
      const pedidoString = JSON.stringify(this.pedidoSeleccionado);
      
      this.router.navigate(['./administrador/recibir-pedido'], { 
        queryParams: { pedido: pedidoString },
        state: { pedido: this.pedidoSeleccionado }
      });
    }
  }

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

  irARegistrar() {
    this.router.navigate(['./administrador/registrar-pedidos']);
  }

  ngOnInit() {
    this.cargarPedidos();
  }
}