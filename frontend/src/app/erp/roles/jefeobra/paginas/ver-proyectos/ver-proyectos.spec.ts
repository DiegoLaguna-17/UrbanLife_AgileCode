import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerProyectos } from './ver-proyectos';

describe('VerProyectos', () => {
  let component: VerProyectos;
  let fixture: ComponentFixture<VerProyectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerProyectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerProyectos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
