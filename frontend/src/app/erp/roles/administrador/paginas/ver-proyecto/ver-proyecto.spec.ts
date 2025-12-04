import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerProyecto } from './ver-proyecto';

describe('VerProyecto', () => {
  let component: VerProyecto;
  let fixture: ComponentFixture<VerProyecto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerProyecto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerProyecto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
