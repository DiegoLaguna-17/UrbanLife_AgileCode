import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-servicios-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios-card.html',
  styleUrl: './servicios-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiciosCard {
  @Input() title = 'Construcción de Edificios';
  @Input() img = 'assets/placeholders/service.png';
  @Input() alt = '';
  @Input() descripcion = 'Ofrecemos servicios de construcción, supervisión y diseño arquitectónico.';
}
