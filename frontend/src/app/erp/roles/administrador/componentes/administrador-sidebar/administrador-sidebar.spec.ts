import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorSidebar } from './administrador-sidebar';

describe('AdministradorSidebar', () => {
  let component: AdministradorSidebar;
  let fixture: ComponentFixture<AdministradorSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministradorSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
