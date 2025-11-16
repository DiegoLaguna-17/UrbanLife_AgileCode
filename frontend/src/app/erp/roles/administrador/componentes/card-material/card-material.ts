import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterialProveedor } from '../card-proveedor/card-proveedor';

@Component({
  selector: 'app-card-material',
  imports: [],
  templateUrl: './card-material.html',
  styleUrl: './card-material.scss'
})
export class CardMaterialComponent {
  @Input() material!: MaterialProveedor;
  @Output() ver = new EventEmitter<MaterialProveedor>();
}