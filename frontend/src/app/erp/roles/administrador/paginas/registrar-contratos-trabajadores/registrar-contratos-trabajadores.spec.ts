import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarContratosTrabajadores } from './registrar-contratos-trabajadores';

describe('RegistrarContratosTrabajadores', () => {
  let component: RegistrarContratosTrabajadores;
  let fixture: ComponentFixture<RegistrarContratosTrabajadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarContratosTrabajadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarContratosTrabajadores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
