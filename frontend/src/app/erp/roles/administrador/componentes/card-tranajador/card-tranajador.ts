import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Trabajador{
  id_trabajador: number;
  fecha_inicio:string;
  fecha_fin: string;
  puesto: string;
  salario: number;
  contrato:string;
  activo:boolean;
  id_proyecto:number;
}

@Component({
  selector: 'app-card-tranajador',
  imports: [],
  templateUrl: './card-tranajador.html',
  styleUrl: './card-tranajador.scss'
})
export class CardTranajador {
  @Input() trabajador!: Trabajador;
  @Output() ver = new EventEmitter<Trabajador>();
}
