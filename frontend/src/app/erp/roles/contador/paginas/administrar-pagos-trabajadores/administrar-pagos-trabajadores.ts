import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CardPagoTrabajador, PagoTrabajador } from '../../componentes/card-pago-trabajador/card-pago-trabajador';

@Component({
  selector: 'app-administrar-pagos-trabajadores',
  imports: [CommonModule, HttpClientModule, CardPagoTrabajador],
  templateUrl: './administrar-pagos-trabajadores.html',
  styleUrl: './administrar-pagos-trabajadores.scss'
})
export class AdministrarPagosTrabajadores implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Señales reactivas
  trabajadores = signal<PagoTrabajador[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  q = signal<string>(''); // Término de búsqueda

  // Propiedades para los modales
  mostrarModal = signal<boolean>(false);
  mostrarModalConfirmarPago = signal<boolean>(false);
  mostrarModalExitoPago = signal<boolean>(false);
  trabajadorSeleccionado = signal<PagoTrabajador | null>(null);

  // Computed para filtrar automáticamente
  trabajadoresFiltrados = computed(() => {
    const termino = this.q().toLowerCase().trim();
    if (!termino) return this.trabajadores();
    return this.trabajadores().filter(t =>
      t.nombre_trabajador.toLowerCase().includes(termino)
    );
  });

  // DATOS DE PRUEBA
  private datosDePrueba: PagoTrabajador[] = [
    {
      id_trabajador: 1,
      nombre_trabajador: "Juan Pérez",
      puesto: "Albañil",
      fecha_inicio: "2024-01-01",
      fecha_fin: "2024-01-31",
      id_proyecto: 1,
      nombre_proyecto: "Edificio Central",
      observacion: "Trabajo excelente",
      salario: 2500.00,
      fecha: "2024-01-31",
      hora_entrada: "08:00"
    },
    {
      id_trabajador: 2,
      nombre_trabajador: "María García",
      puesto: "Electricista",
      fecha_inicio: "2024-01-01",
      fecha_fin: "2024-01-31",
      id_proyecto: 1,
      nombre_proyecto: "Edificio Central",
      observacion: "Instalaciones completadas",
      salario: 2800.00,
      fecha: "2024-01-31",
      hora_entrada: "07:30"
    },
    {
      id_trabajador: 3,
      nombre_trabajador: "Carlos Rodríguez",
      puesto: "Plomero",
      fecha_inicio: "2024-01-15",
      fecha_fin: "2024-01-31",
      id_proyecto: 2,
      nombre_proyecto: "Residencial Las Flores",
      observacion: "",
      salario: 1800.00,
      fecha: "2024-01-31",
      hora_entrada: "08:15"
    },
    {
      id_trabajador: 4,
      nombre_trabajador: "Ana López",
      puesto: "Carpintera",
      fecha_inicio: "2024-01-01",
      fecha_fin: "2024-01-31",
      id_proyecto: 2,
      nombre_proyecto: "Residencial Las Flores",
      observacion: "Muebles terminados",
      salario: 2200.00,
      fecha: "2024-01-31",
      hora_entrada: "07:45"
    },
    {
      id_trabajador: 5,
      nombre_trabajador: "Roberto Sánchez",
      puesto: "Pintor",
      fecha_inicio: "2024-01-20",
      fecha_fin: "2024-01-31",
      id_proyecto: 1,
      nombre_proyecto: "Edificio Central",
      observacion: "Pintura exterior",
      salario: 1500.00,
      fecha: "2024-01-31",
      hora_entrada: "08:30"
    }
  ];

  // Cargar trabajadores - Versión con datos de prueba
  cargarTrabajadores() {
    this.loading.set(true);
    this.error.set('');
    
    // Simulamos una llamada HTTP con setTimeout
    setTimeout(() => {
      try {
        this.trabajadores.set(this.datosDePrueba);
        this.loading.set(false);
        console.log('Trabajadores cargados (datos de prueba):', this.datosDePrueba);
      } catch (err) {
        console.error('Error al cargar trabajadores:', err);
        this.error.set('Error al cargar los trabajadores. Por favor, intenta nuevamente.');
        this.loading.set(false);
      }
    }, 1000);

    // ⚠️ CÓDIGO PARA CUANDO TENGAS EL ENDPOINT REAL
    /*
    this.obtenerTrabajadores().subscribe({
      next: (trabajadores) => {
        this.trabajadores.set(trabajadores);
        console.log("✔️ Trabajadores cargados:", trabajadores);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Error al obtener trabajadores:', error);
        this.error.set('Error al cargar los trabajadores. Por favor, intenta nuevamente.');
        this.loading.set(false);
      }
    });
    */
  }

  // Método para obtener trabajadores desde API
  obtenerTrabajadores() {
    const url = 'http://127.0.0.1:8000/api/get_pagos_trabajadores';
    return this.http.get<PagoTrabajador[]>(url);
  }

  // Ver trabajador - Abre modal con detalles
  verTrabajador(trabajador: PagoTrabajador) {
    console.log('Trabajador seleccionado:', trabajador);
    this.trabajadorSeleccionado.set(trabajador);
    this.mostrarModal.set(true);
  }

  // Abrir modal de confirmación de pago
  abrirModalConfirmarPago() {
    this.mostrarModalConfirmarPago.set(true);
  }

  // Confirmar pago
  confirmarPago() {
    const trabajador = this.trabajadorSeleccionado();
    if (trabajador) {
      console.log('💰 Pago realizado a:', trabajador.nombre_trabajador);
      console.log('Monto:', trabajador.salario);
      // Aquí iría la lógica real para procesar el pago
      // this.http.post(`/api/realizar_pago/${trabajador.id_trabajador}`, {}).subscribe(...)
      
      // Cerrar modales actuales y mostrar modal de éxito
      this.mostrarModalConfirmarPago.set(false);
      this.mostrarModal.set(false);
      this.mostrarModalExitoPago.set(true);
    }
  }

  // Cerrar modal de éxito
  cerrarModalExitoPago() {
    this.mostrarModalExitoPago.set(false);
    this.trabajadorSeleccionado.set(null);
  }

  // Cerrar todos los modales
  cerrarTodosModales() {
    this.mostrarModal.set(false);
    this.mostrarModalConfirmarPago.set(false);
    this.trabajadorSeleccionado.set(null);
  }

  // Cerrar solo el modal principal
  cerrarModal() {
    this.mostrarModal.set(false);
    this.trabajadorSeleccionado.set(null);
  }

  // Formatear fecha
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
    this.cargarTrabajadores();
  }
}