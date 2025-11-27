import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibirPedido } from './recibir-pedido';

describe('RecibirPedido', () => {
  let component: RecibirPedido;
  let fixture: ComponentFixture<RecibirPedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecibirPedido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecibirPedido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
