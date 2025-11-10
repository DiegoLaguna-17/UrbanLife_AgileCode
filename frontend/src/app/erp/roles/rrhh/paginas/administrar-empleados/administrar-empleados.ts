import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardEmpleadoComponent, Empleado } from '../../componentes/card-empleado/card-empleado';

@Component({
  selector: 'app-administrar-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, CardEmpleadoComponent],
  templateUrl: './administrar-empleados.html',
  styleUrl: './administrar-empleados.scss'
})
export class AdministrarEmpleadosComponent {
  terminoBusqueda: string = '';
  
  empleados: Empleado[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      puesto: 'Albañil',
      departamento: 'Construcción',
      fechaIngreso: '2023-01-15',
      estado: 'Activo',
      contrato: 'contrato_albanyl_001.pdf'
    },
    {
      id: 2,
      nombre: 'María García',
      puesto: 'Albañil',
      departamento: 'Construcción',
      fechaIngreso: '2023-02-20',
      estado: 'Activo',
      contrato: 'contrato_albanyl_002.pdf'
    },
    {
      id: 3,
      nombre: 'Carlos López',
      puesto: 'Maestro de obra',
      departamento: 'Construcción',
      fechaIngreso: '2022-11-10',
      estado: 'Activo',
      contrato: 'contrato_maestro_001.pdf'
    },
    {
      id: 4,
      nombre: 'Ana Martínez',
      puesto: 'Escultor',
      departamento: 'Diseño',
      fechaIngreso: '2023-03-05',
      estado: 'Activo',
      contrato: 'contrato_escultor_001.pdf'
    }
  ];

  empleadosFiltrados: Empleado[] = [...this.empleados];

  onBuscar(): void {
    if (!this.terminoBusqueda.trim()) {
      this.empleadosFiltrados = [...this.empleados];
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase().trim();
    this.empleadosFiltrados = this.empleados.filter(empleado =>
      empleado.nombre.toLowerCase().includes(termino) ||
      empleado.puesto.toLowerCase().includes(termino)
    );
  }
}