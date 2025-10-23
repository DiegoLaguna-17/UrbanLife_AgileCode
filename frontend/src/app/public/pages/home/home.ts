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
      logo:"https://lpz.ucb.edu.bo/wp-content/uploads/2024/05/UCB-Ereccion-Canonica_Escudo-01.png",
      name:"Universidad Católica Boliviana"
    },
    {
      logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBj8nUKmU_esHfXuD5qxlGx-xzKU4LmWNMdA&s",
      name:"Pollos Copacabana"
    },
    {
      logo:"https://www.dismac.com.bo/media/default/default/Logo_Dismac_SEO.png",
      name:"Dismac"
    },
    {
      logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDKAcl7tvA6N12d4rLyYnH_nhoaYKncJd0nA&s",
      name:"Breick"
    }
  ];

}
