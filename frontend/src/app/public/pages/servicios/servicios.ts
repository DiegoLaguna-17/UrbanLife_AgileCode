import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresCard } from '../../componentes/proveedores-card/proveedores-card';
import { ServiciosCard } from '../../componentes/servicios-card/servicios-card';
@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, ServiciosCard,ProveedoresCard],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss'
})
export class Servicios {
  servicios = [
    { title: 'Servicios de Construcción y Remodelación',img:"assets/img/servicios/icon1.png" },
    { title: 'Desarrollo y construcción de edificios residenciales y comerciales',img:"assets/img/servicios/icon2.png" },
    { title: 'Diseño y ejecución de viviendas unifamiliares',img:"assets/img/servicios/icon3.png" },
    { title: 'Remodelación y rehabilitación de estructuras existentes' ,img:"assets/img/servicios/icon4.png"},
    { title: 'Planificación y gestión integral de proyectos de construcción' ,img:"assets/img/servicios/icon5.png"},
    { title: 'Cimentaciones, estructuras y reforzamiento de edificaciones',img:"assets/img/servicios/icon6.png" },
    { title:'Supervisión técnica y control de calidad en obra',img:"assets/img/servicios/icon7.png"},
    { title: 'Asesoramiento en selección de materiales y acabados de alto estándar',img:"assets/img/servicios/icon8.png"}
  ];
  proveedores = [
    { name: 'SOBOCE' ,logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdJEFtuFI75IdvRKTNhPiZblpw0C0USWHm-g&s",link:"https://soboce.com/"},
    { name: 'INCERPAZ' ,logo:"https://andabolivia.com/wp-content/uploads/2015/05/logo-incerpaz.png",link:"http://incerpaz.com"},
    { name: 'COBOCE' ,logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE8FRTfrbcYtebDzmAFaSj32JIIzFtGbov2g&s",link:"https://coboce.com"},
    { name: 'ACEROS AREQUIPA' ,logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWXCmO2iUTOKTP2F0A2RZQeDIPJxqvvYULJA&s",link:"https://acerosarequipa.com/bo/es/"},
    { name: 'GLADYMAR' ,logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgyRrVmMGQEAWZTFVLCnVF1ip5oDSY4w1RdA&s",link:"https://gladymar.com.bo "},
  ];

}



