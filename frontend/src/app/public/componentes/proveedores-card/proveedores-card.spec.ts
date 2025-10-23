import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresCard } from './proveedores-card';

describe('ProveedoresCard', () => {
  let component: ProveedoresCard;
  let fixture: ComponentFixture<ProveedoresCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedoresCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedoresCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
