import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardUsuario, Usuario } from '../../componentes/card-usuario/card-usuario';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, CardUsuario, HttpClientModule],
  templateUrl: './administrar-usuarios.html',
  styleUrl: './administrar-usuarios.scss'
})
export class AdministrarUsuarios implements OnInit {
  totalUsuarios = 0;
  totalContadores = 0;
  totalRrhh = 0;
  totalJefes = 0;
  totalAdmins = 0;
  terminoBusqueda: string = '';
  mostrarModalGrafica = false;
  
  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }
  
  filtros = {
    administrador: false,
    contador: false,
    jefeObra: false,
    recursosHumanos: false
  };

  mostrarGrafica() {
    this.mostrarModalGrafica = true;
    setTimeout(() => {
      this.loadChartModal();
    }, 100);
  }

  cerrarModalGrafica() {
    this.mostrarModalGrafica = false;
  }

  loadChartModal() {
    const canvas = document.getElementById('chartRolesModal') as HTMLCanvasElement;
    if (!canvas) {
      console.error('No se encontró el elemento canvas para el modal');
      return;
    }

    const chartExist = Chart.getChart(canvas);
    if (chartExist) {
      chartExist.destroy();
    }

    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Administradores', 'Contadores', 'Recursos Humanos', 'Jefes de Obra'],
        datasets: [{
          data: [
            this.totalAdmins,
            this.totalContadores,
            this.totalRrhh,
            this.totalJefes
          ],
          backgroundColor: [
            '#1E88E5',
            '#43A047',
            '#FB8C00',
            '#8E24AA'
          ],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14
              },
              padding: 20
            }
          },
          title: {
            display: true,
            text: 'Distribución de Usuarios por Rol',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: 20
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw as number;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  loadRolesChart() {
    setTimeout(() => {
      const canvas = document.getElementById('chartRoles') as HTMLCanvasElement;
      if (canvas) {
        const chartExist = Chart.getChart(canvas);
        if (chartExist) {
          chartExist.destroy();
        }

        new Chart(canvas, {
          type: 'pie',
          data: {
            labels: ['Administradores', 'Contadores', 'Recursos Humanos', 'Jefes de Obra'],
            datasets: [{
              data: [
                this.totalAdmins,
                this.totalContadores,
                this.totalRrhh,
                this.totalJefes
              ],
              backgroundColor: [
                '#1E88E5',
                '#43A047',
                '#FB8C00',
                '#8E24AA'
              ],
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: 'Distribución de Usuarios por Rol',
                font: {
                  size: 18,
                  weight: 'bold'
                },
                padding: 20
              }
            }
          }
        });
      }
    }, 500);
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<any>("http://127.0.0.1:8000/api/get_all_usuarios").pipe(
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          this.totalUsuarios = response.data.length;
          
          // Reiniciamos contadores
          this.totalAdmins = 0;
          this.totalContadores = 0;
          this.totalRrhh = 0;
          this.totalJefes = 0;
          
          // Contamos usuarios por rol
          response.data.forEach((r: any) => {
            if (r.rol == "RRHH") {
              this.totalRrhh++;
            } else if (r.rol == "Jefe de obra") {
              this.totalJefes++;
            } else if (r.rol == "Administrador") {
              this.totalAdmins++;
            } else {
              this.totalContadores++;
            }
          });
          
          this.loadRolesChart();
          
          return response.data.map((item: any) => ({
            id: item.id_usuario,
            nombre: item.nombre,
            rol: item.rol,
            correo: item.correo,
            contrasena: '',
            activo: true,
            empleadoId: item.empleadoId
          } as Usuario));
        }
        return [];
      })
    );
  }
  
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  onBuscar(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultados = [...this.usuarios];

    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      resultados = resultados.filter(usuario =>
        usuario.nombre.toLowerCase().includes(termino) ||
        usuario.rol.toLowerCase().includes(termino) ||
        usuario.correo.toLowerCase().includes(termino)
      );
    }

    const hayFiltrosActivos = Object.values(this.filtros).some(filtro => filtro);
    
    if (hayFiltrosActivos) {
      resultados = resultados.filter(usuario => {
        const rol = usuario.rol.toLowerCase();
        return (
          (this.filtros.administrador && rol.includes('administrador')) ||
          (this.filtros.contador && rol.includes('contador')) ||
          (this.filtros.jefeObra && rol.includes('jefe de obra')) ||
          (this.filtros.recursosHumanos && rol.includes('rrhh'))
        );
      });
    }

    this.usuariosFiltrados = resultados;
  }

  limpiarFiltros(): void {
    this.filtros = {
      administrador: false,
      contador: false,
      jefeObra: false,
      recursosHumanos: false
    };
    this.aplicarFiltros();
  }

  ngOnInit(): void {
    this.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = [...usuarios];
        console.log(this.usuarios);
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }
}