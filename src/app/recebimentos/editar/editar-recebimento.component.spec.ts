import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRecebimentoComponent } from './editar-recebimento.component';

describe('EditarRecebimentoComponent', () => {
  let component: EditarRecebimentoComponent;
  let fixture: ComponentFixture<EditarRecebimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarRecebimentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarRecebimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
