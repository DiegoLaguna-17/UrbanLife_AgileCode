import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarPedidos } from './administrar-pedidos';

describe('AdministrarPedidos', () => {
  let component: AdministrarPedidos;
  let fixture: ComponentFixture<AdministrarPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarPedidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarPedidos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
