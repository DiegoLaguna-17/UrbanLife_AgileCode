import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RrhhShell } from './rrhh-shell';

describe('RrhhShell', () => {
  let component: RrhhShell;
  let fixture: ComponentFixture<RrhhShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RrhhShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RrhhShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
