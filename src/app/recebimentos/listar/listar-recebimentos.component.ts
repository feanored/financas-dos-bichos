import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { RecebimentoService } from 'src/app/services/recebimento.service';
import { Recebimento } from '../../shared';
import { ContaService } from 'src/app/contas';

interface Filtro {
  nome: string;
  conta: string;
}

@Component({
  selector: 'app-listar-recebimentos',
  templateUrl: './listar-recebimentos.component.html',
  styleUrls: ['./listar-recebimentos.component.css']
})
export class ListarRecebimentosComponent implements OnInit {

  constructor(
    private recebimentoService: RecebimentoService,
    private contaService: ContaService
    ) { }

  @ViewChild('formFiltroNome', { static: true }) formFiltroNome: NgForm;
  @ViewChild('formFiltroConta', { static: true }) formFiltroConta: NgForm;
  recebimentos: Recebimento[] = [];
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
      this.data_from = this.recebimentoService.getDataMin();
      this.data_to = new Date();
    }
    this.filtro = {nome:'', conta:''};
    if (sessionStorage['filtro_recebimentos']) {
      const filtros_salvos = JSON.parse(sessionStorage['filtro_recebimentos']);
      this.filtro.nome = filtros_salvos.nome;
      this.filtro.conta = filtros_salvos.conta;
    }
    this.total = 0;
    this.filtrar();
  }

  listarTodos(): Recebimento[] {
    const lista = this.recebimentoService.listarTodos();
    if (lista.length > 0)
      return lista.sort((a, b) => <any>new Date(b.data) - <any>new Date(a.data));
    return [];
  }

  apagar($event: any, id: number) {
    $event.preventDefault();
    if (confirm("Tem certeza que quer remover este pagamento?")) {
      // buscar a conta associada e remover o pagamento
      this.recebimentos.forEach(obj => {
        if (obj.id == id) {
          let conta = this.contaService.buscarPorNome(obj.conta);
          if (conta.tipo == "Débito") {
            conta.saldo -= obj.valor;
          } else if (conta.tipo == "Crédito") {
            conta.saldo += obj.valor;
          }
          this.contaService.atualizar(conta);
        }
      });
      this.recebimentoService.remover(id);
      this.filtrar();
    }
  }

  filtrar(): void {
    this.recebimentos = this.listarTodos().filter(z =>
      z.conta.toLowerCase().includes(this.filtro.conta.toLowerCase()) &&
      z.nome.toLowerCase().includes(this.filtro.nome.toLowerCase()) &&
      Date.parse(z.data.toString()) >= this.data_from.valueOf() &&
      Date.parse(z.data.toString()) <= this.data_to.valueOf());
    this.total = 0;
    this.recebimentos.forEach(obj => this.total += obj.valor);
    // salvar os filtros na sessao atual
    sessionStorage['filtro_recebimentos'] = JSON.stringify({
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
