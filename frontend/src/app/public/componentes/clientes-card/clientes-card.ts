import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-clientes-card',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes-card.html',
  styleUrl: './clientes-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientesCard {
 @Input() logo = '';
  @Input() name = '';
  @Input() alt = '';
}



