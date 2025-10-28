import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosPasos } from './dos-pasos';

describe('DosPasos', () => {
  let component: DosPasos;
  let fixture: ComponentFixture<DosPasos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DosPasos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DosPasos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
