import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeobraShell } from './jefeobra-shell';

describe('JefeobraShell', () => {
  let component: JefeobraShell;
  let fixture: ComponentFixture<JefeobraShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JefeobraShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JefeobraShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
