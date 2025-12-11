import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTranajador } from './card-tranajador';

describe('CardTranajador', () => {
  let component: CardTranajador;
  let fixture: ComponentFixture<CardTranajador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTranajador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTranajador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
