import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Recebimento } from '../../shared';
import { ContaService } from '../../contas';
import { RecebimentoService } from '../../services/recebimento.service';

@Component({
  selector: 'app-cadastrar-recebimento',
  templateUrl: './cadastrar-recebimento.component.html',
  styleUrls: ['./cadastrar-recebimento.component.css']
})
export class CadastrarRecebimentoComponent implements OnInit {

  constructor(
    private contaService: ContaService,
    private recebimentoService: RecebimentoService,
    private router: Router
  ) { }

  @ViewChild('formRecebimento', { static: true }) formRecebimento: NgForm;
  contas: string[] = [];
  recebimento: Recebimento;
  dataForm: string;

  ngOnInit(): void {
    this.recebimento = new Recebimento();
    let data = new Date();
    data.setMinutes((data.getMinutes() - data.getTimezoneOffset()));
    this.dataForm = data.toISOString().slice(0, 16);

    // obter as contas para seleção
    this.contaService.listarTodos().forEach(obj => {
      if (!obj.desativado)
        this.contas.push(obj.nome);
    });
  }

  cadastrar(): void {
    if (this.formRecebimento.form.valid) {
      this.recebimento.data = new Date(this.formRecebimento.form.get("data").value);
      this.recebimentoService.cadastrar(this.recebimento);

      // buscar a conta associada e acrescentar a receita
      let conta = this.contaService.buscarPorNome(this.recebimento.conta);
      if (conta.tipo == "Débito") {
        conta.saldo += this.recebimento.valor;
      } else if (conta.tipo == "Crédito") {
        conta.saldo -= this.recebimento.valor;
      }
      this.contaService.atualizar(conta);

      this.router.navigate(["/receitas"]);
    }
  }

}
