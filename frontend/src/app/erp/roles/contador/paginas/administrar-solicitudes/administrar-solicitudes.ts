import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CardSolicitud, Solicitud, MaterialSolicitud } from '../../componentes/card-solicitud/card-solicitud';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-administrar-solicitudes',
  imports: [CommonModule, HttpClientModule, CardSolicitud, ReactiveFormsModule],
  templateUrl: './administrar-solicitudes.html',
  styleUrl: './administrar-solicitudes.scss'
})
export class AdministrarSolicitudes implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Señales reactivas
  solicitudes = signal<Solicitud[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  fechaFiltro = signal<string>(''); // Filtro por fecha

  // Nuevas propiedades para el modal
  mostrarModal = signal<boolean>(false);
  solicitudSeleccionada = signal<Solicitud | null>(null);
  costoTotal = signal<number>(0);
  mostrarModalAceptar = signal<boolean>(false);
  mostrarModalRechazar = signal<boolean>(false);
  mostrarModalExitoAceptar = signal<boolean>(false);
  mostrarModalExitoRechazar = signal<boolean>(false);

  // Formulario para el motivo de rechazo
  rechazoForm: FormGroup;


  // Para filtrar por fecha
  solicitudesFiltradas = computed(() => {
    const fechaSeleccionada = this.fechaFiltro();
    
    if (!fechaSeleccionada) {
      return this.solicitudes();
    }

    return this.solicitudes().filter(solicitud => {
      // Comparar fechas (ignorando la hora)
      const fechaSolicitud = new Date(solicitud.fecha_solicitud).toDateString();
      const fechaFiltro = new Date(fechaSeleccionada).toDateString();
      
      return fechaSolicitud === fechaFiltro;
    });
  });

  // DATOS DE PRUEBA
  private datosDePrueba: Solicitud[] = [
    {
      id_pedido: 1,
      nombre_proveedor: "Materiales Constructivos S.A.",
      fecha_solicitud: "2025-11-15",
      materiales: [
        { material: "Cemento", cantidad: 50, precio_unitario: 25.50 },
        { material: "Arena", cantidad: 100, precio_unitario: 12.75 },
        { material: "Grava", cantidad: 80, precio_unitario: 18.30 }
      ]
    },
    {
      id_pedido: 2,
      nombre_proveedor: "Herramientas Profesionales Ltda.",
      fecha_solicitud: "2025-11-15",
      materiales: [
        { material: "Martillos", cantidad: 15, precio_unitario: 45.00 },
        { material: "Destornilladores", cantidad: 30, precio_unitario: 8.50 },
        { material: "Taladros", cantidad: 5, precio_unitario: 320.00 }
      ]
    },
    {
      id_pedido: 3,
      nombre_proveedor: "Equipos Pesados Internacional",
      fecha_solicitud: "2025-11-16",
      materiales: [
        { material: "Excavadora", cantidad: 1, precio_unitario: 25000.00 },
        { material: "Compactadora", cantidad: 2, precio_unitario: 8500.00 }
      ]
    },
    {
      id_pedido: 4,
      nombre_proveedor: "Insumos Eléctricos Modernos",
      fecha_solicitud: "2025-11-16",
      materiales: [
        { material: "Cable THW 2.5mm", cantidad: 200, precio_unitario: 3.20 },
        { material: "Interruptores", cantidad: 50, precio_unitario: 12.80 },
        { material: "Tubos PVC", cantidad: 100, precio_unitario: 8.45 }
      ]
    },
    {
      id_pedido: 5,
      nombre_proveedor: "Pinturas y Acabados Premium",
      fecha_solicitud: "2025-11-17",
      materiales: [
        { material: "Pintura Latex", cantidad: 25, precio_unitario: 85.00 },
        { material: "Brochas", cantidad: 40, precio_unitario: 15.50 },
        { material: "Rodillos", cantidad: 30, precio_unitario: 12.00 }
      ]
    },
    {
      id_pedido: 6,
      nombre_proveedor: "Cerámicas y Porcelanatos",
      fecha_solicitud: "2025-11-17",
      materiales: [
        { material: "Porcelanato 60x60", cantidad: 150, precio_unitario: 45.00 },
        { material: "Cerámica 30x30", cantidad: 200, precio_unitario: 28.50 },
        { material: "Adhesivo para cerámica", cantidad: 50, precio_unitario: 32.00 }
      ]
    }
  ];

  constructor() {
    this.rechazoForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Cargar solicitudes - Versión con datos de prueba
  cargarSolicitudes() {
    this.loading.set(true);
    this.error.set('');
    
    setTimeout(() => {
      try {
        this.solicitudes.set(this.datosDePrueba);
        this.loading.set(false);
        console.log('Solicitudes cargadas (datos de prueba):', this.datosDePrueba);
      } catch (err) {
        console.error('Error al cargar solicitudes:', err);
        this.error.set('Error al cargar las solicitudes. Por favor, intenta nuevamente.');
        this.loading.set(false);
      }
    }, 1000);

    // CÓDIGO PARA EL ENDPOINT
    /*
    this.obtenerSolicitudes().subscribe({
      next: (solicitudes) => {
        this.solicitudes.set(solicitudes);
        console.log("✔️ Solicitudes cargadas:", solicitudes);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Error al obtener solicitudes:', error);
        this.error.set('Error al cargar las solicitudes. Por favor, intenta nuevamente.');
        this.loading.set(false);
      }
    });
    */
  }

  // PARA OBETENR LAS SOLICITUDES DEL ENDPOINT 
  // obtenerSolicitudes() {
  //   const url = 'http://127.0.0.1:8000/api/get_solicitudes';
  //   return this.http.get<Solicitud[]>(url);
  // }

  // CALCULAR EL COSTO TOTAL DEL PEDIDO 
  calcularCostoTotal(solicitud: Solicitud) {
    if (!solicitud.materiales) {
      this.costoTotal.set(0);
      return;
    }

    const total = solicitud.materiales.reduce((sum, material) => {
      return sum + (material.cantidad * material.precio_unitario);
    }, 0);

    this.costoTotal.set(total);
  }

  // PARA ABRIR EL MODAL CON LA INFORMACIÓN
  verSolicitud(solicitud: Solicitud) {
    console.log('Solicitud seleccionada:', solicitud);
    this.solicitudSeleccionada.set(solicitud);
    this.calcularCostoTotal(solicitud);
    this.mostrarModal.set(true);
  }

  // ABRIR EL MODEAL DE ACEPTAR SOLICITUD
  abrirModalAceptar() {
    this.mostrarModalAceptar.set(true);
  }

  // CONFIRMAR LA ACEPTACIÓN DE LA SOLICITUD
  confirmarAceptar() {
    const solicitud = this.solicitudSeleccionada();
    if (solicitud) {
      console.log('✅ Solicitud aceptada:', solicitud.id_pedido);
      // Cerrar modales actuales y mostrar modal de éxito
      this.mostrarModalAceptar.set(false);
      this.mostrarModal.set(false);
      this.mostrarModalExitoAceptar.set(true);
    }
  }

  // CONFIRMAR EL RECHAZO DE LA SOLICITUD CON EL MENSAJE 
  abrirModalRechazar() {
    this.rechazoForm.reset();
    this.mostrarModalRechazar.set(true);
  }

  //CONFIRMAR EL RECHAZO DE LA SOLICITUD
  confirmarRechazar() {
    if (this.rechazoForm.valid) {
      const solicitud = this.solicitudSeleccionada();
      const motivo = this.rechazoForm.value.motivo;
      
      if (solicitud) {
        console.log('❌ Solicitud rechazada:', solicitud.id_pedido);
        console.log('Motivo:', motivo);
        // Aquí iría la lógica real para rechazar la solicitud
        // this.http.post(`/api/rechazar_solicitud/${solicitud.id_solicitud}`, { motivo }).subscribe(...)
        
        // Cerrar modales actuales y mostrar modal de éxito
        this.mostrarModalRechazar.set(false);
        this.mostrarModal.set(false);
        this.mostrarModalExitoRechazar.set(true);
      }
    }
  }

  // Cerrar modal de éxito aceptar
  cerrarModalExitoAceptar() {
    this.mostrarModalExitoAceptar.set(false);
    this.solicitudSeleccionada.set(null);
    this.costoTotal.set(0);
  }

  // Cerrar modal de éxito rechazar
  cerrarModalExitoRechazar() {
    this.mostrarModalExitoRechazar.set(false);
    this.solicitudSeleccionada.set(null);
    this.costoTotal.set(0);
    this.rechazoForm.reset();
  }

  //PARA CERRAR TODOS LOS MODALES 
  cerrarTodosModales() {
    this.mostrarModal.set(false);
    this.mostrarModalAceptar.set(false);
    this.mostrarModalRechazar.set(false);
    this.solicitudSeleccionada.set(null);
    this.costoTotal.set(0);
    this.rechazoForm.reset();
  }

  // PARA CERRAR EL MODAL DE LA INFORMACION 
  cerrarModal() {
    this.mostrarModal.set(false);
    this.solicitudSeleccionada.set(null);
    this.costoTotal.set(0);
  }

  // BOTON PARA ACEPTAR LA SOLICITUD
  aceptarSolicitud() {
    const solicitud = this.solicitudSeleccionada();
    if (solicitud) {
      console.log('Aceptando solicitud:', solicitud.id_pedido);
      // Aquí iría la lógica para aceptar la solicitud
      alert(`Solicitud ${solicitud.id_pedido} aceptada`);
      this.cerrarModal();
    }
  }

  //BOTON PARA RECHAZAR LA SOLICITUD
  rechazarSolicitud() {
    const solicitud = this.solicitudSeleccionada();
    if (solicitud) {
      console.log('Rechazando solicitud:', solicitud.id_pedido);
      // Aquí iría la lógica para rechazar la solicitud
      alert(`Solicitud ${solicitud.id_pedido} rechazada`);
      this.cerrarModal();
    }
  }

  // Limpiar filtro de fecha
  limpiarFiltro() {
    this.fechaFiltro.set('');
  }

  // Formatear fecha para mostrar en el modal
  formatFecha(fecha: string): string {
    if (!fecha) return '';
    
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  ngOnInit() {
    this.cargarSolicitudes();
  }
}