import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NovedadesCard } from '../../componentes/novedades-card/novedades-card';
import { ClientesCard } from '../../componentes/clientes-card/clientes-card';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NovedadesCard, ClientesCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  novedades=[
    {
      img:"https://assets.xomio.com/listings/images/rl-135855700__0__720.jpg",
      titulo:"Proyecto 1",
      desc:"Nueva obra en desarrollo en Achumani"},
    {
      img:"https://cd1.eju.tv/wp-content/uploads/2015/11/565b07051a78e.jpg",
      titulo:"Proyecto 2",
      desc:"Nueva obra en desarrollo en Miraflores"},
    {
      img:"https://cdn7.ultracasas.com/dyn/yastaimages/8c8e6168d2c0b4b9864fac99e4c3b6e48050b1",
      titulo:"Proyecto 3",
      desc:"Nueva obra en desarrollo en Miraflores"
    }
  ];

  clientes=[
    {
      logo:"assets/img/home/cliente1.png",
      name:"Universidad Católica Boliviana"
    },
    {
      logo:"assets/img/home/cliente2.png",
      name:"Pollos Copacabana"
    },
    {
      logo:"assets/img/home/cliente3.webp",
      name:"Dismac"
    },
    {
      logo:"assets/img/home/cliente4.jpeg",
      name:"Breick"
    }
  ];

}
