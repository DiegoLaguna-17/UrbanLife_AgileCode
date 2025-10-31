import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresCard } from '../../componentes/proveedores-card/proveedores-card';
import { ServiciosCard } from '../../componentes/servicios-card/servicios-card';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, ServiciosCard,ProveedoresCard, HttpClientModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss'
})
export class Servicios {
  constructor(private http: HttpClient){}
  proveedores:any[]=[];
  obtenerProveedores(): Observable<any[]> {
  return this.http.get<any[]>('http://127.0.0.1:8000/api/get_proveedores');
}
ngAfterViewInit() {
  const video = document.querySelector('.hero-video') as HTMLVideoElement;
  if (video) {
    video.muted = true;
    video.play();
  }
}
ngOnInit(){
  /*
  this.obtenerProveedores().subscribe({
    next: (res) => {
      this.proveedores = res; // 👈 Se cargan los objetos en un arreglo
      console.log(this.proveedores);
    },
    error: (err) => console.error(err)
  });
  */
}


  
  servicios = [
    { title: 'Servicios de Construcción y Remodelación',img:"assets/img/servicios/icon1.png",
      descricion:'Ejecución de proyectos de obra nueva y renovación de espacios con calidad, funcionalidad y diseño moderno.' },
    { title: 'Desarrollo y construcción de edificios residenciales y comerciales',img:"assets/img/servicios/icon2.png" 
      ,descricion:'Ejecución integral de multifamiliares, oficinas y centros comerciales, desde estudio de suelos y diseño estructural hasta entrega con acabados de alta calidad.'},
    { title: 'Diseño y ejecución de viviendas unifamiliares',img:"assets/img/servicios/icon3.png",
      descricion:'Casas funcionales, confortables y estéticas, con materiales certificados y técnicas modernas y ecológicas.' },
    { title: 'Remodelación y rehabilitación de estructuras existentes' ,img:"assets/img/servicios/icon4.png",
      descricion:'Renovación de interiores y exteriores con acabados contemporáneos y soluciones sostenibles (albañilería, electricidad, plomería, pintura, etc.).'},
    { title: 'Planificación y gestión integral de proyectos de construcción' ,img:"assets/img/servicios/icon5.png",
      descricion:'Coordinación y supervisión integral de la construcción, planificación técnica y económica, gestión de recursos y control de calidad cumpliendo normas de seguridad y eficiencia.'},
    { title: 'Cimentaciones, estructuras y reforzamiento de edificaciones',img:"assets/img/servicios/icon6.png",
      descricion:'Diseño, ejecución y reforzamiento de cimentaciones y estructuras, con estudios de suelo y cálculos avanzados, prolongando la vida útil conforme a normas vigentes.' },
    { title:'Supervisión técnica y control de calidad en obra',img:"assets/img/servicios/icon7.png",
      descricion:'Supervisión de obra cumpliendo planos y normas, asesoramiento en selección de materiales y acabados de alto estándar, priorizando calidad, durabilidad y diseño moderno.'},
    { title: 'Asesoramiento en selección de materiales y acabados de alto estándar',img:"assets/img/servicios/icon8.png",
      descricion:'Orientación técnica y estética para elegir materiales y acabados de alta calidad, duraderos y modernos, que potencien el valor y estilo de cada proyecto.'}
  ];
  



}



