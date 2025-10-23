import { Component,Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-novedades-card',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './novedades-card.html',
  styleUrl: './novedades-card.scss',
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class NovedadesCard {
    @Input() img = '';
  @Input() titulo = '';
  @Input() alt = '';
}
