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

    ngOnInit(): void {
      const id = +this.route.snapshot.params['id'];
      this.recebimento = this.recebimentoService.buscarPorId(id);

      // obter as contas para seleção
      this.contaService.listarTodos().forEach(obj => {
        this.contas.push(obj.nome);
      });
    }

    atualizar(): void{
      if (this.formRecebimento.form.valid) {
        this.recebimentoService.atualizar(this.recebimento);
        this.router.navigate(['/pagamentos']);
      }
    }

  }
