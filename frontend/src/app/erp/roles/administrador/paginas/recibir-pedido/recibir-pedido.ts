import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Material {
  material: string;
  cantidad: number;
  cantidadRecibida?: number;
  error?: string;
}

interface Pedido {
  id_pedido: number;
  id_proveedor: number;
  nombre_proveedor: string;
  fecha_solicitud: string;
  fecha_llegada_estimada: string;
  fecha_llegada_real: string;
  estado: string;
  mensaje: string;
  monto: number;
  materiales: Material[];
}

@Component({
  selector: 'app-recibir-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './recibir-pedido.html',
  styleUrl: './recibir-pedido.scss'
})
export class RecibirPedido implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute); // AÑADIR ActivatedRoute
  private http = inject(HttpClient);

  // Variables del componente
  pedido: Pedido | null = null;
  materialesConRecepcion: Material[] = [];
  mostrarModalConfirmacion = false;
  mostrarModalExito = false;
  mostrarModalError = false;
  error = '';
  loading = false;

  ngOnInit() {
    // MÉTODO MEJORADO para obtener el pedido
    this.obtenerPedido();
  }

  // Método mejorado para obtener el pedido
  private obtenerPedido(): void {
    // Método 1: Desde state de navegación
    const navigation = this.router.getCurrentNavigation();
    const pedidoFromState = navigation?.extras?.state?.['pedido'] as Pedido;
    
    if (pedidoFromState) {
      this.pedido = pedidoFromState;
      this.inicializarMateriales();
      console.log('Pedido obtenido del state:', this.pedido);
      return;
    }

    // Método 2: Desde queryParams
    this.route.queryParams.subscribe(params => {
      const pedidoParam = params['pedido'];
      if (pedidoParam) {
        try {
          this.pedido = JSON.parse(pedidoParam);
          this.inicializarMateriales();
          console.log('Pedido obtenido de queryParams:', this.pedido);
          return;
        } catch (e) {
          console.error('Error parsing pedido from query params:', e);
        }
      }

      // Método 3: Si todo falla, cargar datos de prueba
      console.warn('No se pudo obtener el pedido, cargando datos de prueba');
      //this.cargarPedidoDePrueba();
    });
  }

  private cargarPedidoDePrueba(): void {
  // Datos de prueba para desarrollo
  this.pedido = {
    id_pedido: 1,
    id_proveedor: 1,
    nombre_proveedor: "Soboce (Prueba)",
    fecha_solicitud: "2024-01-15",
    fecha_llegada_estimada: "2024-01-25",
    fecha_llegada_real: "",
    estado: "transito",
    mensaje: "",
    monto: 1500,
    materiales: [
      { material: "ladrillos", cantidad: 1000 },
      { material: "cemento", cantidad: 50 }
    ]
  };
  this.inicializarMateriales();
  
  console.log('Cargado pedido de prueba:', this.pedido);
}

  // Inicializar materiales
  private inicializarMateriales(): void {
    if (this.pedido && this.pedido.materiales) {
      this.materialesConRecepcion = this.pedido.materiales.map(material => ({
        ...material,
        cantidadRecibida: material.cantidad, // Por defecto, asumimos que llegó todo
        error: ''
      }));
    }
  }

  // El resto de los métodos se mantienen igual...
  volver(): void {
    this.router.navigate(['./administrador/administrar-pedidos']);
  }

  validarCantidad(material: Material): void {
    if (material.cantidadRecibida === undefined || material.cantidadRecibida === null) {
      material.error = 'La cantidad recibida es requerida';
      return;
    }

    if (material.cantidadRecibida < 0) {
      material.error = 'La cantidad no puede ser negativa';
      return;
    }

    if (material.cantidadRecibida > material.cantidad) {
      material.error = `No puede recibir más de ${material.cantidad} unidades`;
      return;
    }

    material.error = '';
  }

  esFormularioValido(): boolean {
    return this.materialesConRecepcion.every(material => 
      material.cantidadRecibida !== undefined && 
      material.cantidadRecibida !== null && 
      material.cantidadRecibida >= 0 && 
      material.cantidadRecibida <= material.cantidad &&
      !material.error
    );
  }

  calcularTotalSolicitado(): number {
    return this.materialesConRecepcion.reduce((total, material) => total + material.cantidad, 0);
  }

  calcularTotalRecibido(): number {
    return this.materialesConRecepcion.reduce((total, material) => 
      total + (material.cantidadRecibida || 0), 0
    );
  }

  prepararConfirmacion(): void {
    if (this.esFormularioValido()) {
      this.mostrarModalConfirmacion = true;
    }
  }

  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion = false;
  }

  confirmarRecepcion(): void {
    this.loading = true;
    this.mostrarModalConfirmacion = false;

    this.actualizarPedido().subscribe({
      next: (respuesta) => {
        console.log("✔️ Recepción registrada correctamente:", respuesta);
        this.loading = false;
        this.mostrarModalExito = true;
      },
      error: (err) => {
        console.error("❌ Error al registrar recepción:", err);
        this.loading = false;
        this.error = "Error al registrar la recepción del pedido";
        this.mostrarModalError = true;
      }
    });
  }

  private actualizarPedido() {
    const datosActualizacion = {
      id_pedido: this.pedido?.id_pedido,
      id_proveedor:this.pedido?.id_proveedor,
      fecha_llegada_real: new Date().toISOString().split('T')[0],
      estado: 'recibido',
      materiales: this.materialesConRecepcion.map(material => ({
        nombre: material.material,
        cantidad: material.cantidadRecibida
      }))
    };

    console.log('Datos a enviar al backend:', datosActualizacion);
    const url= `http://127.0.0.1:8000/api/cambiar_recibido`;
    return this.http.post(url, datosActualizacion);
  }

  cerrarModalExito(): void {
    this.mostrarModalExito = false;
    this.volver();
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
  }
}