import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Proveedor{
  id_proveedor: number;
  nombre: string;
  contacto: string;
  telefono: string;
  correo: string;
  direccion: string;
  visibilidad: boolean;
  logo: string;
  web: string;
}

export interface MaterialProveedor {
  id_material_proveedor: number;
  id_proveedor: number;
  material: string;
  descripcion: string;
}

@Component({
  selector: 'app-card-proveedor',
  imports: [],
  templateUrl: './card-proveedor.html',
  styleUrl: './card-proveedor.scss'
})
export class CardProveedor {
  @Input() proveedor!: Proveedor;
  @Output() ver = new EventEmitter<Proveedor>();
}
