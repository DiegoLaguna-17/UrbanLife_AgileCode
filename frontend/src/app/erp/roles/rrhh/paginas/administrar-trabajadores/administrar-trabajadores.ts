import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CardTrabajador, Trabajador } from '../../componentes/card-trabajador/card-trabajador';
import { map,Observable } from 'rxjs';

@Component({
  selector: 'app-administrar-trabajadores',
  imports: [CommonModule, HttpClientModule, CardTrabajador],
  templateUrl: './administrar-trabajadores.html',
  styleUrl: './administrar-trabajadores.scss'
})
export class AdministrarTrabajadores implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Señales reactivas
  totalTrabajadores=0;
  trabajadores = signal<Trabajador[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  q = signal<string>(''); // Término de búsqueda

  // Computed para filtrar automáticamente
  trabajadoresFiltrados = computed(() => {
    const termino = this.q().toLowerCase().trim();
    if (!termino) return this.trabajadores();
    return this.trabajadores().filter(t =>
      t.nombre.toLowerCase().includes(termino)
    );
  });
  // Lista filtrada de trabajadores

  
  // Cargar trabajadores - Versión con datos de prueba
 cargarTrabajadores() {
  this.obtenerTrabajadores().subscribe({
    next: (trabajadores) => {
      this.totalTrabajadores=trabajadores.length;
      this.trabajadores.set(trabajadores);
      console.log("Trabajadores:", this.trabajadores()); 
      this.loading.set(false); // <── Aquí sí verás el array
    },
    error: (error) => {
      console.error('Error al obtener usuarios:', error);
    }
  });
}


 obtenerTrabajadores(): Observable<Trabajador[]> {
  return this.http.get<any[]>("http://127.0.0.1:8000/api/get_all_trabajadores").pipe(
    map(response =>
      response.map(item => ({
        id_trabajador: item.id_trabajador,
        nombre: item.nombre,
        fecha_nac: item.fecha_nac,
        experiencia: item.experiencia
      }))
    )
  );
}


  // Redirigir a la página de ver trabajador
  verTrabajador(trabajador: Trabajador) {
    this.router.navigate(['/rrhh/ver-trabajador'], { 
      state: { trabajador: trabajador } 
    });
  }

  // Navegar a la página de registrar trabajador
  irARegistrar() {
    this.router.navigate(['/rrhh/registrar-trabajadores']);
  }

  ngOnInit() {
    this.cargarTrabajadores();
  }


}