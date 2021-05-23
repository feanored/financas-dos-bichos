import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Despesa } from '../../shared';
import { ContaService } from '../../contas';
import { DespesaService } from '../../services/despesa.service';

@Component({
  selector: 'app-cadastrar-despesa',
  templateUrl: './cadastrar-despesa.component.html',
  styleUrls: ['./cadastrar-despesa.component.css']
})
export class CadastrarDespesaComponent implements OnInit {

  constructor(
    private contaService: ContaService,
    private despesaService: DespesaService,
    private router: Router
  ) { }

  @ViewChild('formDespesa', { static: true }) formDespesa: NgForm;
  contas: string[] = [];
  despesa: Despesa;
  dataForm: string;

  ngOnInit(): void {
    this.despesa = new Despesa();
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
    if (this.formDespesa.form.valid) {
      this.despesa.data = new Date(this.formDespesa.form.get("data").value);
      this.despesaService.cadastrar(this.despesa);

      // buscar a conta associada e descontar a despesa
      let conta = this.contaService.buscarPorNome(this.despesa.conta);
      if (conta.tipo == "Débito") {
        conta.saldo -= this.despesa.valor;
      } else if (conta.tipo == "Crédito") {
        conta.saldo += this.despesa.valor;
      }
      this.contaService.atualizar(conta);

      this.router.navigate(["/despesas"]);
    }
  }

}
