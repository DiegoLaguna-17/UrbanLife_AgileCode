import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Proyecto, Documento } from '../../componentes/card-proyecto/card-proyecto';

@Component({
  selector: 'app-ver-documentacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-documentacion.html',
  styleUrl: './ver-documentacion.scss'
})
export class VerDocumentacion implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Variables del componente
  proyecto: Proyecto | null = null;
  contratos: Documento[] = [];
  permisos: Documento[] = [];
  planos: Documento[] = [];
  estudios: Documento[] = [];
  
  documentoSeleccionado: Documento | null = null;
  mostrarModalVer = false;

  ngOnInit(): void {
    this.cargarProyecto();
  }

  // Cargar proyecto y organizar documentos
  private cargarProyecto(): void {
    this.route.queryParams.subscribe(params => {
      const proyectoParam = params['proyecto'];
      if (proyectoParam) {
        try {
          this.proyecto = JSON.parse(proyectoParam);
          this.organizarDocumentos();
          console.log('Proyecto cargado:', this.proyecto);
        } catch (e) {
          console.error('Error parsing proyecto:', e);
          this.cargarDatosEjemplo();
        }
      } else {
        // Intentar obtener del state
        const navigation = this.router.getCurrentNavigation();
        const proyectoFromState = navigation?.extras?.state?.['proyecto'] as Proyecto;
        
        if (proyectoFromState) {
          this.proyecto = proyectoFromState;
          this.organizarDocumentos();
        } else {
          this.cargarDatosEjemplo();
        }
      }
    });
  }

  // Organizar documentos por tipo
  private organizarDocumentos(): void {
    if (!this.proyecto?.documentos) {
      this.contratos = [];
      this.permisos = [];
      this.planos = [];
      this.estudios = [];
      return;
    }

    this.contratos = this.proyecto.documentos.filter(doc => 
      this.esContrato(doc.nombre_documento) || this.esContrato(doc.tipo)
    );
    
    this.permisos = this.proyecto.documentos.filter(doc => 
      this.esPermiso(doc.nombre_documento) || this.esPermiso(doc.tipo)
    );
    
    this.planos = this.proyecto.documentos.filter(doc => 
      this.esPlano(doc.nombre_documento) || this.esPlano(doc.tipo)
    );
    
    this.estudios = this.proyecto.documentos.filter(doc => 
      this.esEstudio(doc.nombre_documento) || this.esEstudio(doc.tipo)
    );
  }

  // Métodos para identificar tipos de documentos
  private esContrato(texto: string): boolean {
    const palabrasClave = ['contrato', 'agreement', 'contract', 'convenio', 'acuerdo'];
    return palabrasClave.some(palabra => 
      texto.toLowerCase().includes(palabra.toLowerCase())
    );
  }

  private esPermiso(texto: string): boolean {
    const palabrasClave = ['permiso', 'licencia', 'authorization', 'license', 'aprobación', 'autorización'];
    return palabrasClave.some(palabra => 
      texto.toLowerCase().includes(palabra.toLowerCase())
    );
  }

  private esPlano(texto: string): boolean {
    const palabrasClave = ['plano', 'blueprint', 'plan', 'diseño', 'drawing', 'layout', 'esquema'];
    return palabrasClave.some(palabra => 
      texto.toLowerCase().includes(palabra.toLowerCase())
    );
  }

  private esEstudio(texto: string): boolean {
    const palabrasClave = ['estudio', 'study', 'análisis', 'analysis', 'investigación', 'research', 'informe', 'report'];
    return palabrasClave.some(palabra => 
      texto.toLowerCase().includes(palabra.toLowerCase())
    );
  }

  // Obtener categoría de un documento
  obtenerCategoria(documento: Documento | null): string {
    if (!documento) return 'Desconocida';
    
    if (this.esContrato(documento.nombre_documento) || this.esContrato(documento.tipo)) {
      return 'Contrato';
    }
    if (this.esPermiso(documento.nombre_documento) || this.esPermiso(documento.tipo)) {
      return 'Permiso';
    }
    if (this.esPlano(documento.nombre_documento) || this.esPlano(documento.tipo)) {
      return 'Plano';
    }
    if (this.esEstudio(documento.nombre_documento) || this.esEstudio(documento.tipo)) {
      return 'Estudio';
    }
    
    return 'Otro';
  }

  // Contar documentos por tipo
  contarPorTipo(tipo: string): number {
    switch(tipo) {
      case 'contrato': return this.contratos.length;
      case 'permiso': return this.permisos.length;
      case 'plano': return this.planos.length;
      case 'estudio': return this.estudios.length;
      default: return 0;
    }
  }

  // Contar total de documentos
  contarDocumentosTotales(): number {
    return (this.proyecto?.documentos?.length || 0);
  }

  // Cargar datos de ejemplo
  private cargarDatosEjemplo(): void {
    this.proyecto = {
      id_proyecto: 1,
      nombre: "Condominio Lomas del Sol",
      descripcion: "Construcción de condominio residencial de lujo",
      fecha_inicio: "2024-01-15",
      fecha_fin: "2026-11-20",
      estado: "En progreso",
      presupuesto: 2500000,
      departamento: "Construcción",
      nombre_empleado: "Juan Pérez",
      documentos: [
        { nombre_documento: "Contrato de construcción general", tipo: "PDF", ruta: "/docs/contrato-construccion.pdf" },
        { nombre_documento: "Contrato con subcontratistas", tipo: "PDF", ruta: "/docs/contrato-subcontratistas.pdf" },
        { nombre_documento: "Permiso de construcción municipal", tipo: "PDF", ruta: "/docs/permiso-construccion.pdf" },
        { nombre_documento: "Licencia ambiental", tipo: "PDF", ruta: "/docs/licencia-ambiental.pdf" },
        { nombre_documento: "Planos arquitectónicos completos", tipo: "PDF", ruta: "/docs/planos-arquitectonicos.pdf" },
        { nombre_documento: "Planos estructurales", tipo: "CAD", ruta: "/docs/planos-estructurales.cad" },
        { nombre_documento: "Planos de instalaciones", tipo: "PDF", ruta: "/docs/planos-instalaciones.pdf" },
        { nombre_documento: "Estudio de suelo", tipo: "PDF", ruta: "/docs/estudio-suelo.pdf" },
        { nombre_documento: "Estudio de impacto ambiental", tipo: "PDF", ruta: "/docs/impacto-ambiental.pdf" },
        { nombre_documento: "Estudio de viabilidad económica", tipo: "Excel", ruta: "/docs/viabilidad-economica.xlsx" },
        { nombre_documento: "Permiso de uso de suelo", tipo: "PDF", ruta: "/docs/permiso-uso-suelo.pdf" },
        { nombre_documento: "Contrato de suministro de materiales", tipo: "PDF", ruta: "/docs/contrato-materiales.pdf" }
      ],
      actividades: []
    };
    
    this.organizarDocumentos();
  }

  // Navegación
  volver(): void {
    this.router.navigate(['./administrador/ver-proyecto'], {
      queryParams: { proyecto: JSON.stringify(this.proyecto) }
    });
  }

  anadirDocumento(): void {
    console.log('Añadir documento - Implementar funcionalidad');
    this.router.navigate(['./administrador/registrar-documentos']);
  }

  // Ver documento (abrir modal)
  verDocumento(documento: Documento): void {
    this.documentoSeleccionado = documento;
    this.mostrarModalVer = true;
    console.log('Ver documento:', documento);
  }

  // Cerrar modal
  cerrarModalVer(): void {
    this.mostrarModalVer = false;
    this.documentoSeleccionado = null;
  }

  // Descargar documento (simulado)
  descargarDocumento(documento: Documento): void {
    console.log('Descargando documento:', documento);
    // Simular descarga
    alert(`Descargando: ${documento.nombre_documento}\nTipo: ${documento.tipo}\nRuta: ${documento.ruta}`);
    
    // En una implementación real, aquí iría la lógica de descarga
    // window.open(documento.ruta, '_blank');
  }
}