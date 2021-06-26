import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCategoriasComponent } from './listar-categorias.component';

describe('ListarRecebimentosComponent', () => {
  let component: ListarCategoriasComponent;
  let fixture: ComponentFixture<ListarCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarCategoriasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
