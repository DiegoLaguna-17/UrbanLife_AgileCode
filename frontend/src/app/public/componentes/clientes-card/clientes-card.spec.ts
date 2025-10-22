import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesCard } from './clientes-card';

describe('ClientesCard', () => {
  let component: ClientesCard;
  let fixture: ComponentFixture<ClientesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
