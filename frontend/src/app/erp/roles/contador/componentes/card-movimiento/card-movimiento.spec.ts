import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMovimiento } from './card-movimiento';

describe('CardMovimiento', () => {
  let component: CardMovimiento;
  let fixture: ComponentFixture<CardMovimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMovimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMovimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
