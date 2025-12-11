import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarTrabajadores } from './administrar-trabajadores';

describe('AdministrarTrabajadores', () => {
  let component: AdministrarTrabajadores;
  let fixture: ComponentFixture<AdministrarTrabajadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarTrabajadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarTrabajadores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
