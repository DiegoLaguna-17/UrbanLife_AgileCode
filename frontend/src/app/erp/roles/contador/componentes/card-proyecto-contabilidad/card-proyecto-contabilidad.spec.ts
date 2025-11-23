import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProyectoContabilidad } from './card-proyecto-contabilidad';

describe('CardProyectoContabilidad', () => {
  let component: CardProyectoContabilidad;
  let fixture: ComponentFixture<CardProyectoContabilidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProyectoContabilidad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProyectoContabilidad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
