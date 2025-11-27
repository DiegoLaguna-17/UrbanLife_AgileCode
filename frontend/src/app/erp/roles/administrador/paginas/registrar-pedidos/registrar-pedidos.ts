import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Proyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  fecha_fin: string;
}

interface MaterialProveedor {
  id_material_proveedor: number;
  material: string;
}

interface Proveedor {
  id_proveedor: number;
  nombre_proveedor: string;
  correo: string;
  materiales: MaterialProveedor[];
}

interface ProductoPedido {
  material_proveedor_id: number;
  nombre_material: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-registrar-pedidos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registrar-pedidos.html',
  styleUrl: './registrar-pedidos.scss'
})
export class RegistrarPedidos implements OnInit {
  pedidoForm: FormGroup;
  private router = inject(Router);
  private http = inject(HttpClient);
  
  // Variables de control
  pasoActual: number = 1;
  productoActualIndex: number = 0;
  mostrarModalExito: boolean = false;
  mostrarModalError: boolean = false;
  mostrarModalConfirmacion: boolean = false;
  loading: boolean = false;
  error: string = '';
  
  // Datos del backend - SIMULADOS
  proyectos: Proyecto[] = [];
  proveedores: Proveedor[] = [];
  materialesProveedor: MaterialProveedor[] = [];
  materialesDisponibles: MaterialProveedor[] = [];

  // Datos para el modal de confirmación
  proveedorSeleccionadoNombre: string = '';
  costoTotal: number = 0;
  productosConfirmacion: ProductoPedido[] = [];

  // Cache para mapear IDs a nombres de materiales
  private materialesMap: Map<number, string> = new Map();

  // Datos simulados para pruebas
  private proyectosSimulados: Proyecto[] = [
    {
      id_proyecto: 1,
      nombre_proyecto: "Condominio Lomas del sol",
      fecha_fin: "2026-11-20"
    },
    {
      id_proyecto: 2,
      nombre_proyecto: "Puente viacha",
      fecha_fin: "2027-11-20"
    },
    {
      id_proyecto: 3,
      nombre_proyecto: "Edificio Central",
      fecha_fin: "2025-08-15"
    }
  ];

  private proveedoresSimulados: Proveedor[] = [
    {
      id_proveedor: 1,
      nombre_proveedor: "Soboce",
      correo: "proveedor1@gmail.com",
      materiales: [
        { id_material_proveedor: 1, material: "ladrillos" },
        { id_material_proveedor: 2, material: "cemento" },
        { id_material_proveedor: 3, material: "arena" },
        { id_material_proveedor: 4, material: "grava" }
      ]
    },
    {
      id_proveedor: 2,
      nombre_proveedor: "Cemento Viacha",
      correo: "proveedor2@gmail.com",
      materiales: [
        { id_material_proveedor: 5, material: "mezclador" },
        { id_material_proveedor: 6, material: "cemento especial" },
        { id_material_proveedor: 7, material: "cal" },
        { id_material_proveedor: 8, material: "yeso" }
      ]
    },
    {
      id_proveedor: 3,
      nombre_proveedor: "Hierros Bolivia",
      correo: "hierros@bolivia.com",
      materiales: [
        { id_material_proveedor: 9, material: "varilla corrugada 1/2" },
        { id_material_proveedor: 10, material: "varilla corrugada 3/8" },
        { id_material_proveedor: 11, material: "alambre negro" },
        { id_material_proveedor: 12, material: "malla electrosoldada" }
      ]
    },
    {
      id_proveedor: 4,
      nombre_proveedor: "Maderas del Oriente",
      correo: "maderas@oriente.com",
      materiales: [
        { id_material_proveedor: 13, material: "madera pino" },
        { id_material_proveedor: 14, material: "triplay" },
        { id_material_proveedor: 15, material: "clavos" },
        { id_material_proveedor: 16, material: "tornillos" }
      ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.pedidoForm = this.fb.group({
      // Datos principales del pedido
      proyecto: ['', Validators.required],
      proveedor: ['', Validators.required],
      producto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      precio: ['', [Validators.required, Validators.min(0.1)]],
      
      // Array para productos adicionales
      productosAdicionales: this.fb.array([])
    });

    // Suscribirse a cambios en el producto principal
    this.pedidoForm.get('producto')?.valueChanges.subscribe(() => {
      this.actualizarMaterialesDisponibles();
    });
  }

  ngOnInit(): void {
    this.cargarProyectos();
    this.cargarProveedores();
  }

  // Método para volver a la página principal
  volver(): void {
    this.router.navigate(['./administrador/administrar-pedidos']);
  }

  // Cargar datos SIMULADOS del backend
  cargarProyectos(): void {
    of(this.proyectosSimulados).pipe(delay(500)).subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        console.log('Proyectos cargados:', proyectos);
      },
      error: (err) => {
        console.error('Error al cargar proyectos:', err);
        this.error = 'Error al cargar los proyectos';
        this.mostrarModalError = true;
        this.proyectos = this.proyectosSimulados;
      }
    });
  }

  cargarProveedores(): void {
    of(this.proveedoresSimulados).pipe(delay(800)).subscribe({
      next: (proveedores) => {
        this.proveedores = proveedores;
        console.log('Proveedores cargados:', proveedores);
        // Inicializar el mapa de materiales
        this.inicializarMaterialesMap();
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
        this.error = 'Error al cargar los proveedores';
        this.mostrarModalError = true;
        this.proveedores = this.proveedoresSimulados;
        this.inicializarMaterialesMap();
      }
    });
  }

  // Inicializar el mapa de materiales para búsquedas rápidas
  private inicializarMaterialesMap(): void {
    this.materialesMap.clear();
    this.proveedores.forEach(proveedor => {
      proveedor.materiales.forEach(material => {
        this.materialesMap.set(material.id_material_proveedor, material.material);
      });
    });
    console.log('Mapa de materiales inicializado:', this.materialesMap);
  }

  // Manejar cambios en los selects
  onProyectoChange(): void {
    console.log('Proyecto seleccionado:', this.proyecto?.value);
  }

  onProveedorChange(): void {
    const proveedorId = this.proveedor?.value;
    console.log('Proveedor seleccionado:', proveedorId);
    
    const proveedorSeleccionado = this.proveedores.find(p => p.id_proveedor == proveedorId);
    
    if (proveedorSeleccionado) {
      this.materialesProveedor = proveedorSeleccionado.materiales;
      this.materialesDisponibles = [...this.materialesProveedor]; // Copia inicial
      console.log('Materiales del proveedor:', this.materialesProveedor);
    } else {
      this.materialesProveedor = [];
      this.materialesDisponibles = [];
    }
    
    // Resetear producto seleccionado
    this.producto?.setValue('');
    this.actualizarMaterialesDisponibles();
  }

  // CORRECCIÓN: Actualizar materiales disponibles filtrando los ya seleccionados
  actualizarMaterialesDisponibles(): void {
    const materialesSeleccionados = this.obtenerMaterialesSeleccionados();
    
    console.log('Materiales seleccionados para filtrar:', materialesSeleccionados);
    console.log('Materiales disponibles antes de filtrar:', this.materialesProveedor);
    
    // Filtrar los materiales que NO están en la lista de seleccionados
    this.materialesDisponibles = this.materialesProveedor.filter(material => 
      !materialesSeleccionados.includes(material.id_material_proveedor)
    );
    
    console.log('Materiales disponibles después de filtrar:', this.materialesDisponibles);
  }

  // Obtener todos los IDs de materiales ya seleccionados
  obtenerMaterialesSeleccionados(): number[] {
    const materialesSeleccionados: number[] = [];
    
    // Agregar el material del primer producto si está seleccionado
    const productoPrincipal = this.producto?.value;
    if (productoPrincipal) {
      materialesSeleccionados.push(Number(productoPrincipal));
    }
    
    // Agregar materiales de productos adicionales
    this.productosAdicionales.controls.forEach(control => {
      const productoId = control.get('producto')?.value;
      if (productoId) {
        materialesSeleccionados.push(Number(productoId));
      }
    });
    
    console.log('IDs de materiales seleccionados:', materialesSeleccionados);
    return materialesSeleccionados;
  }

  // CORRECCIÓN: Obtener nombre del material por ID usando el mapa
  obtenerNombreMaterial(id: number): string {
    const nombre = this.materialesMap.get(id);
    console.log(`Buscando material ID ${id}:`, nombre);
    return nombre || `Material ID ${id}`;
  }

  // Preparar datos para el modal de confirmación
  prepararModalConfirmacion(): void {
    const proveedorId = this.proveedor?.value;
    const proveedor = this.proveedores.find(p => p.id_proveedor == proveedorId);
    this.proveedorSeleccionadoNombre = proveedor ? proveedor.nombre_proveedor : 'Proveedor no seleccionado';
    
    // Calcular productos y costo total
    this.productosConfirmacion = [];
    this.costoTotal = 0;

    // Producto principal
    if (this.producto?.value && this.cantidad?.value && this.precio?.value) {
      const productoId = Number(this.producto.value);
      const cantidad = Number(this.cantidad.value);
      const precio = Number(this.precio.value);
      const subtotal = cantidad * precio;
      
      this.productosConfirmacion.push({
        material_proveedor_id: productoId,
        nombre_material: this.obtenerNombreMaterial(productoId),
        cantidad: cantidad,
        precio_unitario: precio,
        subtotal: subtotal
      });
      this.costoTotal += subtotal;
    }

    // Productos adicionales
    this.productosAdicionales.controls.forEach(control => {
      const productoId = Number(control.get('producto')?.value);
      const cantidad = Number(control.get('cantidad')?.value);
      const precio = Number(control.get('precio')?.value);
      
      if (productoId && cantidad && precio) {
        const subtotal = cantidad * precio;
        this.productosConfirmacion.push({
          material_proveedor_id: productoId,
          nombre_material: this.obtenerNombreMaterial(productoId),
          cantidad: cantidad,
          precio_unitario: precio,
          subtotal: subtotal
        });
        this.costoTotal += subtotal;
      }
    });

    console.log('Productos para confirmación:', this.productosConfirmacion);
    this.mostrarModalConfirmacion = true;
  }

  // Botones de acción del panel izquierdo
  hacerPedido(): void {
    console.log('Hacer pedido clickeado');
    if (this.esFormularioValido()) {
      this.prepararModalConfirmacion();
    } else {
      this.marcarCamposComoTouched();
      this.error = 'Por favor, complete todos los campos obligatorios correctamente.';
      this.mostrarModalError = true;
    }
  }

  anadirMasProductos(): void {
    console.log('Añadir más productos clickeado');
    if (this.esPrimerProductoValido()) {
      this.pasoActual = 2;
      this.agregarProductoAdicional();
      console.log('Producto adicional agregado. Total:', this.productosAdicionales.length);
    } else {
      this.marcarCamposComoTouched();
      this.error = 'Por favor, complete el primer producto correctamente antes de añadir más.';
      this.mostrarModalError = true;
    }
  }

  cancelar(): void {
    console.log('Cancelar clickeado');
    this.pedidoForm.reset();
    this.productosAdicionales.clear();
    this.pasoActual = 1;
    this.productoActualIndex = 0;
    this.materialesDisponibles = [...this.materialesProveedor];
    this.router.navigate(['./administrar_pedidos']);
  }

  // Manejo de productos adicionales
  get productosAdicionales(): FormArray {
    return this.pedidoForm.get('productosAdicionales') as FormArray;
  }

  agregarProductoAdicional(): void {
    const productoGroup = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      precio: ['', [Validators.required, Validators.min(0.1)]]
    });
    
    // Suscribirse a cambios en el producto para actualizar materiales disponibles
    productoGroup.get('producto')?.valueChanges.subscribe(() => {
      this.actualizarMaterialesDisponibles();
    });
    
    this.productosAdicionales.push(productoGroup);
    this.productoActualIndex = this.productosAdicionales.length - 1;
    
    // Actualizar materiales disponibles después de agregar
    this.actualizarMaterialesDisponibles();
    
    console.log('Nuevo producto adicional agregado. Índice actual:', this.productoActualIndex);
  }

  getProductoAdicionalControl(): FormControl {
    const control = this.productosAdicionales.at(this.productoActualIndex)?.get('producto');
    return control as FormControl;
  }

  getCantidadAdicionalControl(): FormControl {
    const control = this.productosAdicionales.at(this.productoActualIndex)?.get('cantidad');
    return control as FormControl;
  }

  getPrecioAdicionalControl(): FormControl {
    const control = this.productosAdicionales.at(this.productoActualIndex)?.get('precio');
    return control as FormControl;
  }

  anteriorProducto(): void {
    if (this.productoActualIndex > 0) {
      this.productoActualIndex--;
      console.log('Producto anterior. Índice actual:', this.productoActualIndex);
    }
  }

  siguienteProducto(): void {
    if (this.esProductoAdicionalValido()) {
      if (this.esUltimoProducto()) {
        console.log('Último producto completado. Enviando formulario...');
        this.onSubmit();
      } else {
        this.productoActualIndex++;
        console.log('Siguiente producto. Índice actual:', this.productoActualIndex);
        if (this.productoActualIndex >= this.productosAdicionales.length) {
          this.agregarProductoAdicional();
        }
      }
    }
  }

  esUltimoProducto(): boolean {
    return this.productoActualIndex === this.productosAdicionales.length - 1;
  }

  // Validaciones
  esFormularioValido(): boolean {
    if (this.pasoActual === 1) {
      return this.esPrimerProductoValido() && 
             !!this.proyecto?.valid && 
             !!this.proveedor?.valid;
    } else {
      return this.esPrimerProductoValido() && 
             !!this.proyecto?.valid && 
             !!this.proveedor?.valid && 
             this.productosAdicionales.valid;
    }
  }

  esPrimerProductoValido(): boolean {
    return !!this.producto?.valid && 
           !!this.cantidad?.valid && 
           !!this.precio?.valid;
  }

  esProductoAdicionalValido(): boolean {
    const productoControl = this.getProductoAdicionalControl();
    const cantidadControl = this.getCantidadAdicionalControl();
    const precioControl = this.getPrecioAdicionalControl();
    
    return !!productoControl?.valid && 
           !!cantidadControl?.valid && 
           !!precioControl?.valid;
  }

  // Progreso
  getProgreso(): number {
    if (this.pasoActual === 1) {
      return 50;
    } else {
      const totalProductos = this.productosAdicionales.length + 1;
      const progresoPorProducto = 50 / totalProductos;
      return 50 + (progresoPorProducto * (this.productoActualIndex + 1));
    }
  }

  getTextoProgreso(): string {
    if (this.pasoActual === 1) {
      return 'Paso 1 de 2 - 50% completado';
    } else {
      const totalProductos = this.productosAdicionales.length + 1;
      return `Producto ${this.productoActualIndex + 2} de ${totalProductos + 1} - ${this.getProgreso().toFixed(0)}% completado`;
    }
  }

  // Confirmar pedido desde el modal
  confirmarPedido(): void {
    this.mostrarModalConfirmacion = false;
    this.onSubmit();
  }

  // Cancelar pedido desde el modal
  cancelarPedido(): void {
    this.mostrarModalConfirmacion = false;
  }

  // Envío del formulario SIMULADO
  onSubmit(): void {
    console.log('Enviando formulario...');
    
    this.loading = true;
    
    const pedidoData = {
      proyecto_id: this.proyecto?.value,
      proveedor_id: this.proveedor?.value,
      productos: [
        {
          material_proveedor_id: this.producto?.value,
          cantidad: this.cantidad?.value,
          precio_unitario: this.precio?.value
        },
        ...this.productosAdicionales.controls.map(control => ({
          material_proveedor_id: control.get('producto')?.value,
          cantidad: control.get('cantidad')?.value,
          precio_unitario: control.get('precio')?.value
        }))
      ]
    };

    console.log('Datos del pedido a enviar:', pedidoData);

    // Simulamos el envío al backend
    of({ success: true, id_pedido: Math.floor(Math.random() * 1000) + 1 })
      .pipe(delay(1500))
      .subscribe({
        next: (respuesta) => {
          console.log("✔️ Pedido registrado correctamente:", respuesta);
          this.loading = false;
          this.pedidoForm.reset();
          this.productosAdicionales.clear();
          this.pasoActual = 1;
          this.productoActualIndex = 0;
          this.materialesDisponibles = [...this.materialesProveedor];
          this.mostrarModalExito = true;
        },
        error: (err) => {
          this.loading = false;
          console.error("❌ Error simulado:", err);
          this.error = "Error simulado al registrar el pedido";
          this.mostrarModalError = true;
        }
      });
  }

  // Métodos para modales
  cerrarModalExito(): void {
    this.mostrarModalExito = false;
    this.volver();
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
  }

  private marcarCamposComoTouched(): void {
    Object.keys(this.pedidoForm.controls).forEach(key => {
      const control = this.pedidoForm.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormArray) {
        const formArray = control as FormArray;
        formArray.controls.forEach((group: AbstractControl) => {
          if (group instanceof FormGroup) {
            Object.keys(group.controls).forEach(subKey => {
              group.get(subKey)?.markAsTouched();
            });
          }
        });
      }
    });
  }

  // Getters para fácil acceso
  get proyecto() { return this.pedidoForm.get('proyecto'); }
  get proveedor() { return this.pedidoForm.get('proveedor'); }
  get producto() { return this.pedidoForm.get('producto'); }
  get cantidad() { return this.pedidoForm.get('cantidad'); }
  get precio() { return this.pedidoForm.get('precio'); }
}