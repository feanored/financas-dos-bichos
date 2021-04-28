import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDespesasComponent } from './listar-despesas.component';

describe('ListarDespesasComponent', () => {
  let component: ListarDespesasComponent;
  let fixture: ComponentFixture<ListarDespesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarDespesasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarDespesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
