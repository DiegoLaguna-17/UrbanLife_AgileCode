import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDocumentacion } from './ver-documentacion';

describe('VerDocumentacion', () => {
  let component: VerDocumentacion;
  let fixture: ComponentFixture<VerDocumentacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerDocumentacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerDocumentacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
