import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarPresupuestosProyectos } from './administrar-presupuestos-proyectos';

describe('AdministrarPresupuestosProyectos', () => {
  let component: AdministrarPresupuestosProyectos;
  let fixture: ComponentFixture<AdministrarPresupuestosProyectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarPresupuestosProyectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarPresupuestosProyectos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
