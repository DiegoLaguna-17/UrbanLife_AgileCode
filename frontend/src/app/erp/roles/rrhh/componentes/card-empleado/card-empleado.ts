import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface Empleado {
  id: number;
  nombre: string;
  puesto: string;
  contrato?: string;
}

@Component({
  selector: 'app-card-empleado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-empleado.html',
  styleUrl: './card-empleado.scss'
})
export class CardEmpleadoComponent {
  @Input() empleado!: Empleado;

  constructor(private router: Router) {}

  onVerClick(): void {
    console.log('Navegando a empleado:', this.empleado.id);
    // Navegamos pasando el ID como parámetro y los datos como state
    this.router.navigate(['/rrhh/ver-empleado', this.empleado.id], {
      state: { empleado: this.empleado }
    });
  }
}