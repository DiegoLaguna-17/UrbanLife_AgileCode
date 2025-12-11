import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarProyectos } from './administrar-proyectos';

describe('AdministrarProyectos', () => {
  let component: AdministrarProyectos;
  let fixture: ComponentFixture<AdministrarProyectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarProyectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarProyectos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
