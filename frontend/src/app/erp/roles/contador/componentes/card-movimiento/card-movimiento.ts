import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movimiento } from '../interfaces';

@Component({
  selector: 'app-card-movimiento',
  imports: [CommonModule],
  templateUrl: './card-movimiento.html',
  styleUrl: './card-movimiento.scss'
})
export class CardMovimiento {
  @Input() movimiento!: Movimiento;
  @Output() ver = new EventEmitter<Movimiento>();

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
  }

  formatPrecio(precio: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(precio);
  }
}