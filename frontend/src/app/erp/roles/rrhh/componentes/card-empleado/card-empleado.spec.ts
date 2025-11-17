import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEmpleadoComponent } from './card-empleado';

describe('CardEmpleado', () => {
  let component: CardEmpleadoComponent;
  let fixture: ComponentFixture<CardEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEmpleadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
