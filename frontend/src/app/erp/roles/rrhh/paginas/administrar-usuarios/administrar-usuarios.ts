import { Component,Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardUsuario, Usuario } from '../../componentes/card-usuario/card-usuario';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map,Observable } from 'rxjs';
import { Chart, registerables } from 'chart.js';
@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, CardUsuario,HttpClientModule],
  templateUrl: './administrar-usuarios.html',
  styleUrl: './administrar-usuarios.scss'
})
export class AdministrarUsuarios {
  totalUsuarios=0;
  totalContadores=0;
  totalRrhh=0;
  totalJefes=0;
  totalAdmins=0;
  terminoBusqueda: string = '';
  constructor( private http: HttpClient) {
    Chart.register(...registerables);
  }
  filtros = {
    administrador: false,
    contador: false,
    jefeObra: false,
    recursosHumanos: false

    
  };
  loadRolesChart() {
  new Chart("chartRoles", {
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
          '#1E88E5',  // azul
          '#43A047',  // verde
          '#FB8C00',  // naranja
          '#8E24AA'   // morado
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

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<any>("http://127.0.0.1:8000/api/get_all_usuarios").pipe(
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          this.totalUsuarios=response.data.length;
          console.log(this.totalUsuarios)
          response.data.forEach((r:any)=>{
            if(r.rol=="RRHH"){
              this.totalRrhh++;
            }else if(r.rol=="Jefe de obra"){
              this.totalJefes++;
            }else if(r.rol=="Administrador"){
              this.totalAdmins++;
            }else{
              this.totalContadores++;
            }
          })
          this.loadRolesChart();
          return response.data.map((item: any) => ({
            id: item.id_usuario,
            nombre: item.nombre,
            rol: item.rol,
            correo: item.correo,
            contrasena: '', // No viene en la respuesta, lo dejamos vacío
            activo: true,   // Puedes cambiar esto según tu lógica
            empleadoId: item.empleadoId
          } as Usuario));
        }
        return [];
      })
    );
  }
  
  
  usuarios: Usuario[] = [];
    /*
    {
      id: 1,
      nombre: 'Juan Pérez',
      rol: 'Administrador',
      correo: 'juan.perez@urbanlife.com',
      contrasena: '********',
      activo: true,
      empleadoId: 1
    },
    {
      id: 2,
      nombre: 'María García',
      rol: 'Contador',
      correo: 'maria.garcia@urbanlife.com',
      contrasena: '********',
      activo: true,
      empleadoId: 2
    },
    {
      id: 3,
      nombre: 'Carlos López',
      rol: 'Jefe de Obra',
      correo: 'carlos.lopez@urbanlife.com',
      contrasena: '********',
      activo: true,
      empleadoId: 3
    },
    {
      id: 4,
      nombre: 'Ana Martínez',
      rol: 'Recursos Humanos',
      correo: 'ana.martinez@urbanlife.com',
      contrasena: '********',
      activo: true,
      empleadoId: 4
    },
    {
      id: 5,
      nombre: 'Pedro Rodríguez',
      rol: 'Administrador',
      correo: 'pedro.rodriguez@urbanlife.com',
      contrasena: '********',
      activo: true,
      empleadoId: 5
    },
    {
      id: 6,
      nombre: 'Laura Sánchez',
      rol: 'Contador',
      correo: 'laura.sanchez@urbanlife.com',
      contrasena: '********',
      activo: false,
      empleadoId: 6
    }
  ];
*/
  usuariosFiltrados: Usuario[] = [...this.usuarios];

  onBuscar(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultados = [...this.usuarios];

    // Aplicar filtro de búsqueda por texto
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      resultados = resultados.filter(usuario =>
        usuario.nombre.toLowerCase().includes(termino) ||
        usuario.rol.toLowerCase().includes(termino) ||
        usuario.correo.toLowerCase().includes(termino)
      );
    }

    // Aplicar filtros por rol solo si hay algún filtro activo
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
    // ✅ Suscribirse al observable para obtener los datos
    this.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = [...usuarios]; // para los filtros
        console.log(this.usuarios)
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

}