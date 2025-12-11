import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerActividades } from './ver-actividades';

describe('VerActividades', () => {
  let component: VerActividades;
  let fixture: ComponentFixture<VerActividades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerActividades]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerActividades);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
