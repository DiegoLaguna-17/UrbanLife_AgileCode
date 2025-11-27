import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Pedido{
  id_pedido: number;
  id_proveedor: number;
  nombre_proveedor: string;
  fecha_solicitud: string;
  fecha_llegada_estimada: string;
  fecha_llegada_real: string;
  estado: string;
  mensaje: string;
  monto: number;
  materiales: Materiales [];
}

export interface Materiales{
  material: string;
  cantidad: number;
  cantidadRecibida?: number;
}

@Component({
  selector: 'app-card-pedido',
  imports: [],
  templateUrl: './card-pedido.html',
  styleUrl: './card-pedido.scss'
})
export class CardPedido {
  @Input() pedido!: Pedido;
  @Output() ver = new EventEmitter<Pedido>();
}
