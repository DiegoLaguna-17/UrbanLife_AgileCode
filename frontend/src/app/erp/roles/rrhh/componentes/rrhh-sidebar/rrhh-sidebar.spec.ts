import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RrhhSidebar } from './rrhh-sidebar';

describe('RrhhSidebar', () => {
  let component: RrhhSidebar;
  let fixture: ComponentFixture<RrhhSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RrhhSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RrhhSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
