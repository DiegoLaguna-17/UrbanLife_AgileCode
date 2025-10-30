import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCambiarContra } from './card-cambiar-contra';

describe('CardCambiarContra', () => {
  let component: CardCambiarContra;
  let fixture: ComponentFixture<CardCambiarContra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCambiarContra]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCambiarContra);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
