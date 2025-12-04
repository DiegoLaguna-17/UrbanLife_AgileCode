import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProyecto } from './card-proyecto';

describe('CardProyecto', () => {
  let component: CardProyecto;
  let fixture: ComponentFixture<CardProyecto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProyecto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProyecto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
