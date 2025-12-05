import { Component, computed, signal, inject, OnInit,AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardPedido, Pedido, Materiales } from '../../componentes/card-pedido/card-pedido';
import { map, Observable, of } from 'rxjs';
import { delay, reduce } from 'rxjs/operators';
import { Chart,ArcElement,registerables,
  Tooltip,
  Legend } from 'chart.js';
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
    // REGISTRAMOS LOS COMPONENTES NECESARIOS PARA PIE CHART
    Chart.register(...registerables);
  }
  // Señales reactivas
  pedidos = signal<Pedido[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  fechaFiltro = signal<string>('');
  estadosFiltro = signal<string[]>(['pendiente', 'aceptado', 'rechazado', 'transito', 'recibido']);
  totalTransito:any=0;
  totalRecibidos:any=0;
  totalRechazados:any=0;
  totalPendiente:any=0;
  totalAceptados:any=0;
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
  ];

  // Cargar pedidos - Versión con datos de prueba
  cargarPedidos() {
    this.obtenerPedidos();
  }

  obtenerPedidos() {
    // Simulamos una llamada HTTP
   const url =`http://127.0.0.1:8000/api/get_all_pedidos`;
    this.http.get<any>(url).subscribe({
      next: (response)=>{
        response.data.forEach((p:any)=>{
          if(p.estado=="rechazado"){
            this.totalRechazados++;
          }else if(p.estado=="recibido"){
            this.totalRecibidos++;
          }else if(p.estado=="transito"){
            this.totalTransito++;
          }else if(p.estado=="pendiente"){
            this.totalPendiente++;

          }else{
            this.totalAceptados++;
          }
        });
        this.loadPieChart();
        this.pedidos.set(response.data);
        console.log('Pedidos cargados')
        console.log(response.data)
        this.loading.set(false);
      },
      error:(err)=>{
        console.log('Error al cargar pedidos ',err)
        this.loading.set(false);
      }
    });

    
  }
   

  loadPieChart() {
    const recibidos = this.totalRecibidos;
    const transito = this.totalTransito;
    const rechazados = this.totalRechazados;
    const aceptados=this.totalAceptados;
    const pendientes=this.totalPendiente;

    new Chart("estadoPedidos", {
      type: 'pie',
      data: {
        labels: ['Recibidos', 'En Tránsito', 'Rechazados','Aceptados','Pendientes'],
        datasets: [{
          data: [recibidos, transito, rechazados,aceptados,pendientes],
          backgroundColor: ['#4CAF50', '#2196F3', '#F44336','#9C27B0', '#FF9800']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title:{
             display: true,
          text: 'Estado de Pedidos',   // 🔥 TÍTULO
          font: {
            size: 18,
            weight: 'bold'
          },
          padding:20
          }
        }
      }
    });
  }

  obtenerDash(){
    const url="http://127.0.0.1:8000/api/dashboard_data";
    this.http.get(url).subscribe({
      next:(response:any)=>{
        this.totalRechazados=response.totalRechazados;
        this.totalRecibidos=response.totalRecibidos;
        this.totalTransito=response.totalTransito;
        console.log('Total rechazados ',this.totalRechazados)
        console.log('Total recibidos ',this.totalRecibidos)
        console.log('Total en transito ',this.totalTransito)
        
      },
      error:(err)=>{
        console.log('Error al obtener datos de dashboard ',err.error)
      }
    })
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
      
      const url=`http://127.0.0.1:8000/api/cambiar_transito`;
      const body={
        id_pedido:this.pedidoSeleccionado.id_pedido,
        fecha_llegada_estimada: this.fechaLlegadaEstimada,
        estado:'transito',
        
      }

      this.http.put(url,body).subscribe({
        next:(response)=>{
          console.log('Pedido actualizado transito')
        },
        error:(err)=>{
          console.log('Error al actualizar pedido transito')
        } 
      })

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
    //this.obtenerDash();
    this.cargarPedidos();
    
  }
}
