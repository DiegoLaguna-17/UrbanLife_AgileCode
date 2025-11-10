import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEmpleado } from './ver-empleado';

describe('VerEmpleado', () => {
  let component: VerEmpleado;
  let fixture: ComponentFixture<VerEmpleado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerEmpleado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerEmpleado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
