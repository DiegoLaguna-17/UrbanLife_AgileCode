import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarSolicitudes } from './administrar-solicitudes';

describe('AdministrarSolicitudes', () => {
  let component: AdministrarSolicitudes;
  let fixture: ComponentFixture<AdministrarSolicitudes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarSolicitudes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarSolicitudes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
