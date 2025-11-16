import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMaterial } from './card-material';

describe('CardMaterial', () => {
  let component: CardMaterial;
  let fixture: ComponentFixture<CardMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMaterial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMaterial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
