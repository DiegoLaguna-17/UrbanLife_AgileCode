import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialProveedor } from '../card-proveedor/card-proveedor';

@Component({
  selector: 'app-material-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './material-form.html',
  styleUrl: './material-form.scss'
})
export class MaterialForm implements OnInit {
  @Input() material?: MaterialProveedor;
  @Input() idProveedor!: number;
  @Input() editar: boolean = false;
  @Output() guardarMaterial = new EventEmitter<MaterialProveedor>();
  @Output() cancelarAccion = new EventEmitter<void>();

  materialForm!: FormGroup;
  modoEdicion: boolean = false;
  mostrarModalExito: boolean = false;
  mostrarModalError: boolean = false;
  mensajeError: string = '';

  private fb = inject(FormBuilder);

  ngOnInit() {
    this.inicializarFormulario();
    this.modoEdicion = !this.editar;
  }

  inicializarFormulario() {
    this.materialForm = this.fb.group({
      material: [
        this.material?.material || '', 
        [Validators.required, Validators.minLength(2)]
      ],
      descripcion: [
        this.material?.descripcion || ''
      ]
    });

    if (this.editar && !this.modoEdicion) {
      this.materialForm.disable();
    }
  }

  activarEdicion() {
    this.modoEdicion = true;
    this.materialForm.enable();
  }

  cancelar() {
    if (this.editar && this.modoEdicion) {
      this.materialForm.patchValue({
        material: this.material?.material || '',
        descripcion: this.material?.descripcion || ''
      });
      this.modoEdicion = false;
      this.materialForm.disable();
    } else {
      this.cancelarAccion.emit();
    }
  }

  guardar() {
    if (this.materialForm.valid) {
      const materialData: MaterialProveedor = {
        id_material_proveedor: this.material?.id_material_proveedor || 0,
        id_proveedor: this.idProveedor,
        material: this.materialForm.value.material.trim(),
        descripcion: this.materialForm.value.descripcion.trim()
      };

      if (!materialData.material) {
        this.mostrarError('El nombre del material es requerido');
        return;
      }

      this.guardarMaterial.emit(materialData);
      this.mostrarExito();
    } else {
      this.mostrarError('Por favor complete todos los campos requeridos correctamente');
      Object.keys(this.materialForm.controls).forEach(key => {
        this.materialForm.get(key)?.markAsTouched();
      });
    }
  }

  mostrarExito() {
    this.mostrarModalExito = true;
  }

  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    this.mostrarModalError = true;
  }

  cerrarModalError() {
    this.mostrarModalError = false;
  }

  cerrarModalExito() {
    this.mostrarModalExito = false;
  }

  volverAtras() {
    this.cancelarAccion.emit();
  }

  get materialControl() { return this.materialForm.get('material'); }
  get descripcionControl() { return this.materialForm.get('descripcion'); }
}