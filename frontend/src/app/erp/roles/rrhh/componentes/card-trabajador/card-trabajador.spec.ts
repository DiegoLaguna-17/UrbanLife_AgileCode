import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTrabajador } from './card-trabajador';

describe('CardTrabajador', () => {
  let component: CardTrabajador;
  let fixture: ComponentFixture<CardTrabajador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTrabajador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTrabajador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
