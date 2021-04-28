import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContaService } from 'src/app/contas';

import { Despesa } from '../../shared';
import { DespesaService } from '../../services/despesa.service';

interface Filtro {
  nome: string;
  conta: string;
}

@Component({
  selector: 'app-listar-despesas',
  templateUrl: './listar-despesas.component.html',
  styleUrls: ['./listar-despesas.component.css']
})
export class ListarDespesasComponent implements OnInit {

  constructor(
    private despesaService: DespesaService,
    private contaService: ContaService
    ) { }

  @ViewChild('formFiltroNome', { static: true }) formFiltroNome: NgForm;
  @ViewChild('formFiltroConta', { static: true }) formFiltroConta: NgForm;
  despesas: Despesa[] = [];
  filtro: Filtro;
  total: number;
  data_from: Date;
  data_to: Date;

  ngOnInit(): void {
    const filtros = localStorage['filtros_graficos'] ?
      JSON.parse(localStorage['filtros_graficos']) : null;
    if (filtros) {
      this.data_from = new Date(filtros.data_from);
      this.data_to = new Date(filtros.data_to);
    } else {
      this.data_from = this.despesaService.getDataMin();
      this.data_to = new Date();
    }
    this.filtro = {nome:'', conta:''};
    if (sessionStorage['filtro_despesas']) {
      const filtros_salvos = JSON.parse(sessionStorage['filtro_despesas']);
      this.filtro.nome = filtros_salvos.nome;
      this.filtro.conta = filtros_salvos.conta;
    }
    this.total = 0;
    this.filtrar();
  }

  listarTodos(): Despesa[] {
    const lista = this.despesaService.listarTodos();
    if (lista.length > 0)
      return lista.sort((a, b) => b.id - a.id);
    return [];
  }

  apagar($event: any, id: number) {
    $event.preventDefault();
    if (confirm("Tem certeza que quer remover esta despesa?")) {
      // buscar a conta associada e remover a despesa
      this.despesas.forEach(obj => {
        if (obj.id == id) {
          let conta = this.contaService.buscarPorNome(obj.conta);
          if (conta.tipo == "Débito") {
            conta.saldo += obj.valor;
          } else if (conta.tipo == "Crédito") {
            conta.saldo -= obj.valor;
          }
          this.contaService.atualizar(conta);
        }
      });
      this.despesaService.remover(id);
      this.filtrar();
    }
  }

  filtrar(): void {
    this.despesas = this.listarTodos().filter(z =>
      z.conta.toLowerCase().includes(this.filtro.conta.toLowerCase()) &&
      z.nome.toLowerCase().includes(this.filtro.nome.toLowerCase()) &&
      Date.parse(z.data.toString()) >= this.data_from.valueOf() &&
      Date.parse(z.data.toString()) <= this.data_to.valueOf());
    this.total = 0;
    this.despesas.forEach(obj => this.total += obj.valor);
    // salvar os filtros na sessao atual
    sessionStorage['filtro_despesas'] = JSON.stringify({
      'nome':this.filtro.nome, 'conta':this.filtro.conta});
  }

  limparFiltro(op: number): void {
    if (op == 1)
      this.filtro.nome = "";
    else if (op == 2)
      this.filtro.conta = "";
    this.filtrar();
  }

}
