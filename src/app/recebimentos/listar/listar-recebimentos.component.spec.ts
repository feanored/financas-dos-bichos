import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarRecebimentosComponent } from './listar-recebimentos.component';

describe('ListarRecebimentosComponent', () => {
  let component: ListarRecebimentosComponent;
  let fixture: ComponentFixture<ListarRecebimentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarRecebimentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarRecebimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
