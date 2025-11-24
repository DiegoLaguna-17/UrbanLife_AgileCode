export interface Movimiento {
  id_contabilidad:number;
  movimiento: string;
  fecha: string;
  tipo: string;
  monto: number;
  descripcion: string;
}

export interface MovimientoPresupuesto {
  id_contabilidad: number;
  movimiento: string;
  monto: number;
}

export interface ContabilidadProyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  movimientos: Movimiento[];
}

export interface PresupuestoProyecto {
  id_proyecto: number;
  nombre_proyecto:string;
  presupuesto: number;
  movimientos: MovimientoPresupuesto[];
}

export interface CapitalProyecto {
  ingresos_totales: number;
  egresos_totales: number;
  presupuesto_actual: number;
}