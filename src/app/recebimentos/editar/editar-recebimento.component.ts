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
        this.recebimentoService.atualizar(this.recebimento);
        this.router.navigate(['/pagamentos']);
      }
    }

  }
