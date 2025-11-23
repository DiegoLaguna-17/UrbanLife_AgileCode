import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface PagoTrabajador {
  id_trabajador: number;
  nombre_trabajador: string;
  puesto: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_proyecto: number;
  nombre_proyecto: string;
  observacion: string;
  salario: number;
  fecha: string;
  hora_entrada: string;
}

@Component({
  selector: 'app-card-pago-trabajador',
  imports: [],
  templateUrl: './card-pago-trabajador.html',
  styleUrl: './card-pago-trabajador.scss'
})
export class CardPagoTrabajador {
  @Input() pagoTrabajador!: PagoTrabajador;
  @Output() ver = new EventEmitter<PagoTrabajador>();
}
