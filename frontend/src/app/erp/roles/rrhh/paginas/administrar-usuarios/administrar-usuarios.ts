import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardUsuario, Usuario } from '../../componentes/card-usuario/card-usuario';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, CardUsuario],
  templateUrl: './administrar-usuarios.html',
  styleUrl: './administrar-usuarios.scss'
})
export class AdministrarUsuarios {
  terminoBusqueda: string = '';
  
  filtros = {
    administrador: false,
    contador: false,
    jefeObra: false,
    recursosHumanos: false
  };
  
  usuarios: Usuario[] = [
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
          (this.filtros.recursosHumanos && rol.includes('recursos humanos'))
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
}