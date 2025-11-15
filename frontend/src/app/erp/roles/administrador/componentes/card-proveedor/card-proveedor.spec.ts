import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProveedor } from './card-proveedor';

describe('CardProveedor', () => {
  let component: CardProveedor;
  let fixture: ComponentFixture<CardProveedor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProveedor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProveedor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
