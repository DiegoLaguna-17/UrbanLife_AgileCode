import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContadorSidebar } from './contador-sidebar';

describe('ContadorSidebar', () => {
  let component: ContadorSidebar;
  let fixture: ComponentFixture<ContadorSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContadorSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContadorSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
