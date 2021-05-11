import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Recebimento } from '../../shared';
import { ContaService } from '../../contas';
import { RecebimentoService } from '../../services/recebimento.service';

@Component({
  selector: 'app-editar-recebimento',
  templateUrl: './editar-recebimento.component.html',
  styleUrls: ['./editar-recebimento.component.css']
})
export class EditarRecebimentoComponent implements OnInit {

    constructor(
      private contaService: ContaService,
      private recebimentoService: RecebimentoService,
      private router: Router,
      private route: ActivatedRoute
    ) { }

    @ViewChild('formRecebimento', { static: true }) formRecebimento: NgForm;
    contas: string[] = [];
    recebimento: Recebimento;
    dataForm: string;

    ngOnInit(): void {
      const id = +this.route.snapshot.params['id'];
      this.recebimento = this.recebimentoService.buscarPorId(id);
      let data = new Date(this.recebimento.data);
      data.setMinutes((data.getMinutes() - data.getTimezoneOffset()));
      this.dataForm = data.toISOString().slice(0, 16);

      // obter as contas para seleção
      this.contaService.listarTodos().forEach(obj => {
        this.contas.push(obj.nome);
      });
    }

    atualizar(): void{
      if (this.formRecebimento.form.valid) {
        this.recebimento.data = new Date(this.formRecebimento.form.get("data").value);
        const novo_valor = this.formRecebimento.form.get("valor").value;
        // buscar a conta associada e acrescentar o pagamento
        let conta = this.contaService.buscarPorNome(this.recebimento.conta);
        if (conta.tipo == "Débito") {
          conta.saldo -= this.recebimento.valor;
          conta.saldo += novo_valor;
        } else if (conta.tipo == "Crédito") {
          conta.saldo += this.recebimento.valor;
          conta.saldo -= novo_valor;
        }
        this.contaService.atualizar(conta);
        this.recebimento.valor = novo_valor;
        this.recebimentoService.atualizar(this.recebimento);
        this.router.navigate(['/pagamentos']);
      }
    }

  }
