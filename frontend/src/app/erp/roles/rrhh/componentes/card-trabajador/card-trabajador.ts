import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Trabajador {
  id_trabajador: number;
  nombre: string;
  experiencia: string;
  fecha_nac: string;
}

@Component({
  selector: 'app-card-trabajador',
  templateUrl: './card-trabajador.html',
  styleUrl: './card-trabajador.scss'
})
export class CardTrabajador {
  @Input() trabajador!: Trabajador;
  @Output() ver = new EventEmitter<Trabajador>();
}