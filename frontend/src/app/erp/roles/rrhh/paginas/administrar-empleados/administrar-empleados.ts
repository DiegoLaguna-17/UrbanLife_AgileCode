import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CardEmpleadoComponent, Empleado } from '../../componentes/card-empleado/card-empleado';

@Component({
  selector: 'app-administrar-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, CardEmpleadoComponent],
  templateUrl: './administrar-empleados.html',
  styleUrl: './administrar-empleados.scss'
})
export class AdministrarEmpleadosComponent implements OnInit {
  terminoBusqueda: string = '';

  // Ahora empiezan vacíos, se llenan desde el backend
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  totalEmpleados=0;
  private apiUrl = 'http://127.0.0.1:8000/api/get_all_empleados';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.http.get<{ success: boolean; data: any[] }>(this.apiUrl).subscribe({
      next: (resp) => {

        if (resp.success && Array.isArray(resp.data)) {
          this.totalEmpleados=resp.data.length;
          // Mapeamos los campos del backend a tu interfaz Empleado
          this.empleados = resp.data.map((e) => ({
            id: e.id_empleado,
            nombre: e.nombre ?? '',
            puesto: e.puesto ?? '',
            contrato: e.contrato ?? ''
          })) as Empleado[];

          this.empleadosFiltrados = [...this.empleados];
        } else {
          console.error('Respuesta inesperada del backend', resp);
        }
      },
      error: (err) => {
        console.error('Error al cargar empleados:', err);
      }
    });
  }

  onBuscar(): void {
    if (!this.terminoBusqueda.trim()) {
      this.empleadosFiltrados = [...this.empleados];
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase().trim();
    this.empleadosFiltrados = this.empleados.filter((empleado) =>
      empleado.nombre.toLowerCase().includes(termino) ||
      empleado.puesto.toLowerCase().includes(termino)
    );
  }
}
