import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CardProyecto, Proyecto } from '../../componentes/card-proyecto/card-proyecto';
import { map, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-administrar-proyectos',
  imports: [CommonModule, HttpClientModule, CardProyecto],
  templateUrl: './administrar-proyectos.html',
  styleUrl: './administrar-proyectos.scss'
})
export class AdministrarProyectos implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Señales reactivas
  proyectos = signal<Proyecto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  q = signal<string>(''); // Término de búsqueda
  totalProyectos=0;
  // Computed para filtrar automáticamente
  proyectosFiltrados = computed(() => {
    const termino = this.q().toLowerCase().trim();
    if (!termino) return this.proyectos();
    return this.proyectos().filter(p =>
      p.nombre.toLowerCase().includes(termino)
    );
  });

  // Datos de prueba simulados
  private proyectosSimulados: Proyecto[] = [
  ];

  // Cargar proyectos para misa datos de prueba
  cargarProyectos(): void {
    this.obtenerProyectos().subscribe({
      next: (proyectos) => {
        this.totalProyectos=proyectos.length;
        this.proyectos.set(proyectos);
        console.log("Proyectos cargados:", proyectos);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener proyectos:', err);
        this.error.set('Error al cargar los proyectos');
        this.loading.set(false);
        // En caso de error, cargamos datos simulados
        this.proyectos.set(this.proyectosSimulados);
        this.loading.set(false);
      }
    });
  }

  obtenerProyectos(): Observable<Proyecto[]> {
    // Simulamos una llamada HTTP

    
    // Para usar con backend real, descomenta esto:
  
    return this.http.get<Proyecto[]>("http://127.0.0.1:8000/api/get_all_proyectos_data");
    
  }

  // Ver proyecto
  verProyecto(proyecto: Proyecto): void {
    const proyectoString = JSON.stringify(proyecto);
    this.router.navigate(['./administrador/ver-proyecto'], { 
      queryParams: { proyecto: proyectoString }
    });
  }

  // Navegar a la página de registrar proyecto
  irARegistrar(): void {
    this.router.navigate(['./administrador/crear-proyectos']);
  }

  ngOnInit(): void {
    this.cargarProyectos();
  }
}