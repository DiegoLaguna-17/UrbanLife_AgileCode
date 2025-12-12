import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Trabajador{
  id_contratacion_trabajador:number;
  trabajador_id_trabajador: number;
  fecha_inicio:string;
  fecha_fin: string;
  puesto: string;
  salario: number;
  contrato:string;
  observacion:string;
  activo:boolean;
  proyecto_id_proyecto:number;
  nombre:string;
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
