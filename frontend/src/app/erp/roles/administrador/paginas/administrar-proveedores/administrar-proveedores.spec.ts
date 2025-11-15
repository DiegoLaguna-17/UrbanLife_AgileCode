import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarProveedores } from './administrar-proveedores';

describe('AdministrarProveedores', () => {
  let component: AdministrarProveedores;
  let fixture: ComponentFixture<AdministrarProveedores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarProveedores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarProveedores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
