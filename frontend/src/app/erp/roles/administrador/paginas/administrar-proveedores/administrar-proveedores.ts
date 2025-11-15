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

  // Computed para filtrar automáticamente
  proveedoresFiltrados = computed(() => {
    const termino = this.q().toLowerCase().trim();
    if (!termino) return this.proveedores();
    return this.proveedores().filter(p =>
      p.nombre.toLowerCase().includes(termino)
    );
  });

  // DATOS DE PRUEBA - Simulan la respuesta de la API
  private datosDePrueba: Proveedor[] = [
    {
      id_proveedor: 1,
      nombre: "Materiales Constructivos S.A.",
      contacto: "Juan Pérez",
      telefono: "555-1234",
      correo: "ventas@materialesconstructivos.com",
      direccion: "Av. Principal #123, Ciudad",
      visibilidad: true,
      logo: "logo1.png",
      web: "www.materialesconstructivos.com"
    },
    {
      id_proveedor: 2,
      nombre: "Herramientas Profesionales Ltda.",
      contacto: "María García",
      telefono: "555-5678",
      correo: "contacto@herramientaspro.com",
      direccion: "Calle Secundaria #456, Ciudad",
      visibilidad: true,
      logo: "logo2.png",
      web: "www.herramientaspro.com"
    },
    {
      id_proveedor: 3,
      nombre: "Equipos Pesados Internacional",
      contacto: "Carlos Rodríguez",
      telefono: "555-9012",
      correo: "info@equipospesados.com",
      direccion: "Zona Industrial #789, Ciudad",
      visibilidad: true,
      logo: "logo3.png",
      web: "www.equipospesados.com"
    },
    {
      id_proveedor: 4,
      nombre: "Insumos Eléctricos Modernos",
      contacto: "Ana López",
      telefono: "555-3456",
      correo: "ventas@insumoselectricos.com",
      direccion: "Av. Tecnológica #321, Ciudad",
      visibilidad: true,
      logo: "logo4.png",
      web: "www.insumoselectricos.com"
    },
    {
      id_proveedor: 5,
      nombre: "Pinturas y Acabados Premium",
      contacto: "Roberto Sánchez",
      telefono: "555-7890",
      correo: "cliente@pinturaspremium.com",
      direccion: "Calle Color #654, Ciudad",
      visibilidad: true,
      logo: "logo5.png",
      web: "www.pinturaspremium.com"
    },
    {
      id_proveedor: 6,
      nombre: "Cerámicas y Porcelanatos",
      contacto: "Laura Morales",
      telefono: "555-2345",
      correo: "info@ceramicasyporcelanatos.com",
      direccion: "Av. Decoración #987, Ciudad",
      visibilidad: true,
      logo: "logo6.png",
      web: "www.ceramicasyporcelanatos.com"
    }
  ];

  // Cargar proveedores - Versión con datos de prueba
  cargarProveedores() {
    this.loading.set(true);
    this.error.set('');
    
    // Simulamos una llamada HTTP con setTimeout
    setTimeout(() => {
      try {
        // Usamos los datos de prueba en lugar de la API real
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

  // Método para obtener proveedores desde API (listo para cuando tengas el endpoint)
  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<any[]>("http://127.0.0.1:8000/api/get_all_proveedores").pipe(
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