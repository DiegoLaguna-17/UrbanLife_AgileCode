import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContabilidadProyecto } from '../interfaces';

@Component({
  selector: 'app-card-proyecto-contabilidad',
  imports: [],
  templateUrl: './card-proyecto-contabilidad.html',
  styleUrl: './card-proyecto-contabilidad.scss'
})
export class CardProyectoContabilidad {
  @Input() proyecto!: ContabilidadProyecto;
  @Output() ver = new EventEmitter<ContabilidadProyecto>();
}