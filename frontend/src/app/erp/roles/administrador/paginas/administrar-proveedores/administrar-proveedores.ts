import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CardProveedor, Proveedor } from '../../componentes/card-proveedor/card-proveedor';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-administrar-proveedores',
  imports: [CommonModule, HttpClientModule, CardProveedor],
  templateUrl: './administrar-proveedores.html',
  styleUrl: './administrar-proveedores.scss'
})
export class AdministrarProveedores implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Señales reactivas
  proveedores = signal<Proveedor[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  q = signal<string>(''); // Término de búsqueda

  // para filtrar automáticamente
  proveedoresFiltrados = computed(() => {
    const termino = this.q().toLowerCase().trim();
    if (!termino) return this.proveedores();
    return this.proveedores().filter(p =>
      p.nombre.toLowerCase().includes(termino)
    );
  });

  // DATOS DE PRUEBA
  private datosDePrueba: Proveedor[] = [
    {
      id_proveedor: 1,
      nombre: "Cemento Viacha",
      contacto: "Juan Pérez",
      telefono: "7876554",
      correo: "cementoviacha@cementoviacha.com",
      direccion: "Av. Principal #123",
      visibilidad: true,
      logo: "logo1.png",
      web: "www.cementoviacha.com"
    },
    {
      id_proveedor: 2,
      nombre: "Aceros Aruquipa",
      contacto: "María García",
      telefono: "67112332",
      correo: "servicioaceros@acerosaruquipa.com",
      direccion: "Calle 2 de obrajes #456",
      visibilidad: true,
      logo: "logo2.png",
      web: "www.acerosaruquipa.com"
    },
    {
      id_proveedor: 3,
      nombre: "Soboce",
      contacto: "Carlos Rodríguez",
      telefono: "76543221",
      correo: "informacionsoboce@soboce.com",
      direccion: "Zona Miraflores #789",
      visibilidad: true,
      logo: "logo3.png",
      web: "www.soboce.com"
    }
  ];

  // Cargar proveedores - Versión con datos de prueba
  cargarProveedores() {
    this.loading.set(true);
    this.error.set('');
    
    // Simulamos una llamada HTTP con setTimeout
    setTimeout(() => {
      try {
        // Usamos los datos de prueba
        this.proveedores.set(this.datosDePrueba);
        this.loading.set(false);
        console.log('Proveedores cargados (datos de prueba):', this.datosDePrueba);
      } catch (err) {
        console.error('Error al cargar proveedores:', err);
        this.error.set('Error al cargar los proveedores. Por favor, intenta nuevamente.');
        this.loading.set(false);
      }
    }, 1000);

    // ⚠️ CÓDIGO PARA CUANDO TENGAS EL ENDPOINT REAL (descomenta cuando lo necesites)
    /*
    this.obtenerProveedores().subscribe({
      next: (proveedores) => {
        this.proveedores.set(proveedores);
        console.log("Proveedores:", this.proveedores()); 
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al obtener proveedores:', error);
        this.error.set('Error al cargar los proveedores. Por favor, intenta nuevamente.');
        this.loading.set(false);
      }
    });
    */
  }

  // Método para obtener proveedores desde el endpoint
  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<any[]>("http://127.0.0.1:8000/api/get_proveedores").pipe(
      map(response =>
        response.map(item => ({
          id_proveedor: item.id_proveedor,
          nombre: item.nombre,
          contacto: item.contacto,
          telefono: item.telefono,
          correo: item.correo,
          direccion: item.direccion,
          visibilidad: item.visibilidad,
          logo: item.logo,
          web: item.web
        }))
      )
    );
  }

  // Redirigir a la página de ver proveedor
  verProveedor(proveedor: Proveedor) {
    this.router.navigate(['/administrador/ver-proveedor'], { 
      state: { proveedor: proveedor } 
    });
  }

  // Navegar a la página de registrar proveedor
  irARegistrar() {
    this.router.navigate(['/administrador/registrar-proveedores']);
  }

  ngOnInit() {
    this.cargarProveedores();
  }
} 