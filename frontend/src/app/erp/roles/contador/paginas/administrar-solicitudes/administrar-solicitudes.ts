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
    /*
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
    }, 1000);*/

    // CÓDIGO PARA EL ENDPOINT
    const url = `http://127.0.0.1:8000/api/get_material_pedidos`;

    this.http.get<{ data: Solicitud[] }>(url).subscribe({
      next: (resp) => {
        this.solicitudes.set(resp.data);
        console.log("✔️ Solicitudes cargadas:", resp.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Error al obtener solicitudes:', error);
        this.error.set('Error al cargar las solicitudes. Por favor, intenta nuevamente.');
        this.loading.set(false);
      }
    });

    
  }

  

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
      const body={
        id_pedido:solicitud.id_pedido,
        id_proyecto:solicitud.id_proyecto,
        movimiento:'ingreso',
        descripcion:'compra al proveedor '+solicitud.nombre_proveedor,
        fecha:new Date().toISOString().split('T')[0],
        monto:this.costoTotal(),
        tipo:'compra'
      }
      const url = 'http://127.0.0.1:8000/api/cambiar_aceptado';

  this.http.post<any>(url, body).subscribe({
    next: (response) => {
      console.log('✔ Pedido aceptado exitosamente:', response);

      // 🔥 Actualizar la lista local
      this.solicitudes.update(lista =>
  lista.filter(item => item.id_pedido !== solicitud.id_pedido)
);
     
      // Cerrar modales
      this.mostrarModalAceptar.set(false);
      this.mostrarModal.set(false);

      // Mostrar modal de éxito
      this.mostrarModalExitoAceptar.set(true);
    },

    error: (error) => {
      console.error('❌ Error al aceptar pedido:', error);

      if (error.status === 422) {
        alert('Faltan datos obligatorios o el pedido ya fue aceptado.');
      } else if (error.status === 404) {
        alert('El pedido no existe.');
      } else if (error.status === 500) {
        alert('Error en el servidor. Inténtelo más tarde.');
      } else {
        alert('Error desconocido al aceptar el pedido.');
      }
    }
  });
      
    }
  }

  // CONFIRMAR EL RECHAZO DE LA SOLICITUD CON EL MENSAJE 
  abrirModalRechazar() {
    this.rechazoForm.reset();
    this.mostrarModalRechazar.set(true);
  }

  //CONFIRMAR EL RECHAZO DE LA SOLICITUD
  confirmarRechazar() {
  if (!this.rechazoForm.valid) return;

  const solicitud = this.solicitudSeleccionada();
  const motivo = this.rechazoForm.value.motivo;

  if (!solicitud) return;

  const url = 'http://127.0.0.1:8000/api/cambiar_rechazado';

  const body = {
    id_pedido: solicitud.id_pedido,
    estado: 'rechazado',
    mensaje: motivo
  };

  this.http.put<any>(url, body).subscribe({
    next: (response) => {
      console.log('✔ Pedido rechazado exitosamente:', response);

      // 🔥 Actualizar la lista local con el nuevo estado
      this.solicitudes.update(lista =>
  lista.filter(item => item.id_pedido !== solicitud.id_pedido)
);

      // Cerrar modales
      this.mostrarModalRechazar.set(false);
      this.mostrarModal.set(false);

      // Abrir modal de éxito
      this.mostrarModalExitoRechazar.set(true);
    },

    error: (error) => {
      console.error('❌ Error al rechazar pedido:', error);

      if (error.status === 422)
        alert('Faltan datos obligatorios.');
      else if (error.status === 404)
        alert('El pedido no existe.');
      else if (error.status === 500)
        alert('Error en el servidor.');
      else
        alert('Error desconocido.');
    }
  });
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