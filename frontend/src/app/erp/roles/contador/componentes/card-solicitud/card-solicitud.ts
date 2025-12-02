import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface MaterialSolicitud {
  material: string;
  cantidad: number;
  precio_unitario: number;
}

export interface Solicitud{
  id_pedido: number;
  nombre_proveedor: string;
  fecha_solicitud: string;
  materiales: MaterialSolicitud[];
  id_proyecto:number;
}
@Component({
  selector: 'app-card-solicitud',
  imports: [],
  templateUrl: './card-solicitud.html',
  styleUrl: './card-solicitud.scss'
})
export class CardSolicitud {
  @Input() solicitud!: Solicitud;
  @Output() ver = new EventEmitter<Solicitud>();

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    
    // Si la fecha viene en formato ISO (2024-01-15T00:00:00.000Z)
    const date = new Date(fecha);
    
    // Formatear como dd/mm/yyyy
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
