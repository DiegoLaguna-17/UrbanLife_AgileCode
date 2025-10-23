import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosCard } from './servicios-card';

describe('ServiciosCard', () => {
  let component: ServiciosCard;
  let fixture: ComponentFixture<ServiciosCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
