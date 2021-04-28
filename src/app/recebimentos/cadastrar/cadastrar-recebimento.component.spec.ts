import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarRecebimentoComponent } from './cadastrar-recebimento.component';

describe('CadastrarRecebimentoComponent', () => {
  let component: CadastrarRecebimentoComponent;
  let fixture: ComponentFixture<CadastrarRecebimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastrarRecebimentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrarRecebimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
