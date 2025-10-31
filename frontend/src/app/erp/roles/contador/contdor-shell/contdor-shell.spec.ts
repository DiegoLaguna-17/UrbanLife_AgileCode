import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContdorShell } from './contdor-shell';

describe('ContdorShell', () => {
  let component: ContdorShell;
  let fixture: ComponentFixture<ContdorShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContdorShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContdorShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
