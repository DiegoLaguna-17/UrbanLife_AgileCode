import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeobraSidebar } from './jefeobra-sidebar';

describe('JefeobraSidebar', () => {
  let component: JefeobraSidebar;
  let fixture: ComponentFixture<JefeobraSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JefeobraSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JefeobraSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
