import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorShell } from './administrador-shell';

describe('AdministradorShell', () => {
  let component: AdministradorShell;
  let fixture: ComponentFixture<AdministradorShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministradorShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
