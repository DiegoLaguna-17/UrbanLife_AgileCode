import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPedidos } from './registrar-pedidos';

describe('RegistrarPedidos', () => {
  let component: RegistrarPedidos;
  let fixture: ComponentFixture<RegistrarPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPedidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPedidos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
