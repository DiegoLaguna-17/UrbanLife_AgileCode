import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarTrabajadores } from './registrar-trabajadores';

describe('RegistrarTrabajadores', () => {
  let component: RegistrarTrabajadores;
  let fixture: ComponentFixture<RegistrarTrabajadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarTrabajadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarTrabajadores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
