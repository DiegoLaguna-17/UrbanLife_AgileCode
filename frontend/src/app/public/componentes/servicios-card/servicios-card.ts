import { CommonModule } from '@angular/common';
import { Component,Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-servicios-card',
  imports: [CommonModule],
  templateUrl: './servicios-card.html',
  styleUrl: './servicios-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
    standalone:true,

})
export class ServiciosCard {
  @Input() title = 'Construcción de Edificios';
  @Input() img = 'assets/placeholders/service.png'; // cambia por tu ruta
  @Input() alt = '';
}
