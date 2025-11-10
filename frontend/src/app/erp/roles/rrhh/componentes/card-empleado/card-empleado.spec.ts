import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEmpleado } from './card-empleado';

describe('CardEmpleado', () => {
  let component: CardEmpleado;
  let fixture: ComponentFixture<CardEmpleado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEmpleado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEmpleado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
