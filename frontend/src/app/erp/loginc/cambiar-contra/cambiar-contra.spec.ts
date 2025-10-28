import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContra } from './cambiar-contra';

describe('CambiarContra', () => {
  let component: CambiarContra;
  let fixture: ComponentFixture<CambiarContra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiarContra]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarContra);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
