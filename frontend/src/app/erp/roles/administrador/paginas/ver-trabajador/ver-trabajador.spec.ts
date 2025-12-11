import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTrabajador } from './ver-trabajador';

describe('VerTrabajador', () => {
  let component: VerTrabajador;
  let fixture: ComponentFixture<VerTrabajador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerTrabajador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerTrabajador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
