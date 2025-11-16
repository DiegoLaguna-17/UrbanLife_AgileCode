import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardMaterialComponent } from '../card-material/card-material';
import { MaterialProveedor } from '../card-proveedor/card-proveedor';

@Component({
  selector: 'app-materiales-list',
  imports: [CommonModule, CardMaterialComponent],
  templateUrl: './materiales-list.html',
  styleUrl: './materiales-list.scss'
})
export class MaterialesListComponent {
  @Input() materiales: MaterialProveedor[] = [];
  @Output() seleccionarMaterial = new EventEmitter<MaterialProveedor>();
  @Output() volver = new EventEmitter<void>();

  // Método para volver
  onVolver() {
    this.volver.emit();
  }
}