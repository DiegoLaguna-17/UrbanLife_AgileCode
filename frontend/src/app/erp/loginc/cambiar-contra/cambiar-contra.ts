import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardCambiarContra } from '../componentes/card-cambiar-contra/card-cambiar-contra';
@Component({
  selector: 'app-cambiar-contra',
  imports: [CommonModule,FormsModule,CardCambiarContra],
  templateUrl: './cambiar-contra.html',
  styleUrl: './cambiar-contra.scss'
})
export class CambiarContra {
 
}
