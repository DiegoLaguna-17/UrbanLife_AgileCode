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
  selector: 'app-card-trabajador',
  imports: [],
  templateUrl: './card-trabajador.html',
  styleUrl: './card-trabajador.scss'
})
export class CardTrabajador {
  @Input() trabajador!: Trabajador;
  @Output() ver = new EventEmitter<Trabajador>();
}
