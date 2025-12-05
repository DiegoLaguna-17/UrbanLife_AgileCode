import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarDocumentos } from './registrar-documentos';

describe('RegistrarDocumentos', () => {
  let component: RegistrarDocumentos;
  let fixture: ComponentFixture<RegistrarDocumentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarDocumentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarDocumentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
