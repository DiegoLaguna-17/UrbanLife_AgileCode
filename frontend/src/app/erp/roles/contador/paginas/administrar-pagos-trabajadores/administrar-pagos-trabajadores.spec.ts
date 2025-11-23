import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarPagosTrabajadores } from './administrar-pagos-trabajadores';

describe('AdministrarPagosTrabajadores', () => {
  let component: AdministrarPagosTrabajadores;
  let fixture: ComponentFixture<AdministrarPagosTrabajadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarPagosTrabajadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarPagosTrabajadores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
