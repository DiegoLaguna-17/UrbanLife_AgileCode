import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Proyecto{
  id_proyecto:number;
  nombre:string;
  descripcion:string;
  fecha_inicio:string;
  fecha_fin:string;
  estado:string;
  presupuesto:number
  departamento:string;
  nombre_empleado: string;
  documentos: Documento[];
  actividades: Actividad[];
}

export interface Documento{
  nombre_documento:string;
  tipo:string;
  ruta:string;
}

export interface Actividad{
  nombre_actividad:string;
  descripcion:string;
  fecha:string;
  estado:string;
}

@Component({
  selector: 'app-card-proyecto',
  imports: [],
  templateUrl: './card-proyecto.html',
  styleUrl: './card-proyecto.scss'
})
export class CardProyecto {
  @Input() proyecto!: Proyecto;
  @Output() ver = new EventEmitter<Proyecto>();
}
