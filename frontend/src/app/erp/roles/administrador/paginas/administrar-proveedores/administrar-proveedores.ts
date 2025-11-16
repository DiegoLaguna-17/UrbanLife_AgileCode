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
  ];

  // Cargar proveedores - Versión con datos de prueba
  cargarProveedores() {
  this.loading.set(true);
  this.error.set('');

  this.obtenerProveedores().subscribe({
    next: (proveedores) => {
      this.proveedores.set(proveedores);
      console.log("✔️ Proveedores cargados desde backend:", proveedores);
      this.loading.set(false);
    },
    error: (error) => {
      console.error('❌ Error al obtener proveedores:', error);
      this.error.set('Error al cargar los proveedores. Por favor, intenta nuevamente.');
      this.loading.set(false);
    }
  });
}


 obtenerProveedores() {
  const url = 'http://127.0.0.1:8000/api/get_proveedores';
  return this.http.get<Proveedor[]>(url);
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