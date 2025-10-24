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
    { name: 'Proveedor A' ,logo:"",link:"https://soboce.com/"},
    { name: 'Proveedor B' ,logo:"",link:"https://soboce.com/"},
    { name: 'Proveedor J' ,logo:"",link:"https://soboce.com/"},
    { name: 'Proveedor D' ,logo:"",link:"https://soboce.com/"}
  ];

}



