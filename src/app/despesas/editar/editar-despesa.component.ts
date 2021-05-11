import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Despesa } from '../../shared';
import { ContaService } from '../../contas';
import { DespesaService } from '../../services/despesa.service';

@Component({
  selector: 'app-editar-despesa',
  templateUrl: './editar-despesa.component.html',
  styleUrls: ['./editar-despesa.component.css']
})
export class EditarDespesaComponent implements OnInit {

  constructor(
    private contaService: ContaService,
    private despesaService: DespesaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  @ViewChild('formDespesa', { static: true }) formDespesa: NgForm;
  contas: string[] = [];
  despesa: Despesa;
  dataForm: string;

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.despesa = this.despesaService.buscarPorId(id);
    let data = new Date(this.despesa.data);
    data.setMinutes((data.getMinutes() - data.getTimezoneOffset()));
    this.dataForm = data.toISOString().slice(0, 16);

    // obter as despesas para seleção
    this.contaService.listarTodos().forEach(obj => {
      this.contas.push(obj.nome);
    });
  }

  atualizar(): void{
    if (this.formDespesa.form.valid) {
      this.despesa.data = new Date(this.formDespesa.form.get("data").value);
      const novo_valor = this.formDespesa.form.get("valor").value;
      // buscar a conta associada e descontar a despesa
      let conta = this.contaService.buscarPorNome(this.despesa.conta);
      if (conta.tipo == "Débito") {
        conta.saldo += this.despesa.valor;
        conta.saldo -= novo_valor;
      } else if (conta.tipo == "Crédito") {
        conta.saldo -= this.despesa.valor;
        conta.saldo += novo_valor;
      }
      this.contaService.atualizar(conta);
      this.despesa.valor = novo_valor;
      this.despesaService.atualizar(this.despesa);
      this.router.navigate(['/despesas']);
    }
  }

}
