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
    { title: 'Construcción de Edificios',img:"" },
    { title: 'Refuerzos Estructurales' },
    { title: 'Remodelaciones' },
    { title: 'Supervisión de Obra' },
    { title: 'Diseño Arquitectónico' },
    { title: 'Mantenimiento' }
  ];
  proveedores = [
    { name: 'Proveedor A' ,logo:""},
    { name: 'Proveedor B' },
    { name: 'Proveedor J' },
    { name: 'Proveedor D' }
  ];

}



