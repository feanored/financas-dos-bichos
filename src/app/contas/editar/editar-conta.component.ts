import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Conta } from '../../shared';
import { ContaService } from '../../services/conta.service';
import { DespesaService } from '../../services/despesa.service';
import { RecebimentoService } from '../../services/recebimento.service';

@Component({
  selector: 'app-editar-conta',
  templateUrl: './editar-conta.component.html',
  styleUrls: ['./editar-conta.component.css']
})
export class EditarContaComponent implements OnInit {

  constructor(
    private contaService: ContaService,
    private despesaService: DespesaService,
    private recebimentoService: RecebimentoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  @ViewChild('formConta', { static: true }) formConta: NgForm;
  tipos: string[] = [];
  conta: Conta;

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.conta = this.contaService.buscarPorId(id);
    this.tipos = ['Débito', 'Crédito'];
  }

  atualizar(): void{
    if (this.formConta.form.valid) {
      const conta_old = this.contaService.buscarPorId(this.conta.id);
      if (this.conta.nome != conta_old.nome) {
        let listaDespesas = this.despesaService.buscarPorConta(conta_old.nome);
        listaDespesas.forEach(obj => {
          obj.conta = this.conta.nome;
          this.despesaService.atualizar(obj);
        });
        let listaRecebimentos = this.recebimentoService.buscarPorConta(conta_old.nome);
        listaRecebimentos.forEach(obj => {
          obj.conta = this.conta.nome;
          this.recebimentoService.atualizar(obj);
        });
      }
      this.contaService.atualizar(this.conta);
      this.router.navigate(['/contas']);
    }
  }

  apagar($event: any, id: number) {
    $event.preventDefault();
    if (confirm("Tem certeza que quer apagar esta conta?")) {
      this.contaService.remover(id);
      this.router.navigate(['/contas']);
    }
  }

}
