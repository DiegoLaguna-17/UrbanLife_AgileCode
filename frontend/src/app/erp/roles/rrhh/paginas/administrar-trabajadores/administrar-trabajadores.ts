import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CardTrabajador, Trabajador } from '../../componentes/card-trabajador/card-trabajador';

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
  trabajadores = signal<Trabajador[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  q = signal<string>(''); // Término de búsqueda

  // Lista filtrada de trabajadores
  trabajadoresFiltrados = computed(() => {
    const query = this.q().toLowerCase().trim();
    if (!query) {
      return this.trabajadores();
    }
    
    return this.trabajadores().filter(trabajador =>
      trabajador.nombre.toLowerCase().includes(query)
    );
  });

  // DATOS DE PRUEBA
  private datosDePrueba: Trabajador[] = [
    {
      id_trabajador: 1,
      nombre: "Carlos Rodríguez Méndez",
      experiencia: "Especialista en estructuras metálicas con 8 años de experiencia.",
      fecha_nac: "1985-03-15"
    },
    {
      id_trabajador: 2,
      nombre: "Ana María López García",
      experiencia: "Es e specialización en cimentaciones. 6 años liderando equipos",
      fecha_nac: "1990-07-22"
    },
    {
      id_trabajador: 3,
      nombre: "Miguel Ángel Torres Ruiz",
      experiencia: "Fontanero certificado. Especialista en sistemas de agua potable y drenaje.",
      fecha_nac: "1982-11-08"
    },
    {
      id_trabajador: 4,
      nombre: "Elena Castillo Vargas",
      experiencia: "Electricista industrial con certificaciones internacionales. 9 años instalando sistemas eléctricos.",
      fecha_nac: "1988-05-30"
    },
    {
      id_trabajador: 5,
      nombre: "Roberto Sánchez Jiménez",
      experiencia: "Carpintero especializado en acabados finos. 15 años creando mobiliario.",
      fecha_nac: "1979-12-14"
    },
    {
      id_trabajador: 6,
      nombre: "Laura Patricia Morales",
      experiencia: "Albañil maestra con 10 años de experiencia. Especialista en edificios históricos.",
      fecha_nac: "1987-09-03"
    }
  ];

  // Cargar trabajadores - Versión con datos de prueba
  cargarTrabajadores() {
    this.loading.set(true);
    this.error.set('');
    
    // Simulamos una llamada HTTP con setTimeout
    setTimeout(() => {
      try {
        // Usamos los datos de prueba en lugar de la API real
        this.trabajadores.set(this.datosDePrueba);
        this.loading.set(false);
        console.log('Trabajadores cargados (datos de prueba):', this.datosDePrueba);
      } catch (err) {
        console.error('Error al cargar trabajadores:', err);
        this.error.set('Error al cargar los trabajadores. Por favor, intenta nuevamente.');
        this.loading.set(false);
      }
    }, 1000);
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