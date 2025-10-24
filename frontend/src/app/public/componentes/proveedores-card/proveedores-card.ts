import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-proveedores-card',
  imports: [CommonModule],
  templateUrl: './proveedores-card.html',
  styleUrl: './proveedores-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone:true,
})
export class ProveedoresCard {
  @Input() name = 'Proveedor';
  @Input() logo = 'assets/placeholders/provider.png';
  @Input() link='';
  @Input() alt = '';
}
