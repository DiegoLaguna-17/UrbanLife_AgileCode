import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarEmpleados } from './administrar-empleados';

describe('AdministrarEmpleados', () => {
  let component: AdministrarEmpleados;
  let fixture: ComponentFixture<AdministrarEmpleados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarEmpleados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarEmpleados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
