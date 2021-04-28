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

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.despesa = this.despesaService.buscarPorId(id);
    this.despesa.data = new Date(this.despesa.data.toISOString().slice(0, 16));

    // obter as despesas para seleção
    this.contaService.listarTodos().forEach(obj => {
      this.contas.push(obj.nome);
    });
  }

  atualizar(): void{
    if (this.formDespesa.form.valid) {
      this.despesaService.atualizar(this.despesa);
      this.router.navigate(['/despesas']);
    }
  }

}
