import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarProveedores } from './registrar-proveedores';

describe('RegistrarProveedores', () => {
  let component: RegistrarProveedores;
  let fixture: ComponentFixture<RegistrarProveedores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarProveedores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarProveedores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
