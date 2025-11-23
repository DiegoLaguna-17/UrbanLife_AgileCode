import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPagoTrabajador } from './card-pago-trabajador';

describe('CardPagoTrabajador', () => {
  let component: CardPagoTrabajador;
  let fixture: ComponentFixture<CardPagoTrabajador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPagoTrabajador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPagoTrabajador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
