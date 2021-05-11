import { Injectable } from '@angular/core';
import { Conta, Despesa } from '../shared';
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {

  constructor(private fire: FireService) { }

  private colecao: string = "despesas";

  listarTodos(): Despesa[] {
    const lista = localStorage[this.colecao];
    return lista ? JSON.parse(lista): [];
  }

  getDataMin(): Date {
    var data_min: Date = new Date();
    this.listarTodos().forEach(obj => {
      if (Date.parse(obj.data.toString()) < data_min.valueOf())
        data_min = obj.data;
    });
    return new Date(data_min);
  }

  cadastrar(obj: Despesa): void {
    const lista = this.listarTodos();
    obj.id = new Date().getTime();
    lista.push(obj);
    localStorage[this.colecao] = JSON.stringify(lista);
    this.fire.salvarColecao(1);
  }

  buscarPorId(id: number): Despesa {
    const lista: Despesa[] = this.listarTodos();
    return lista.find(obj => obj.id == id);
  }

  buscarPorConta(conta: string): Despesa[] {
    const lista: Despesa[] = this.listarTodos();
    return lista.filter(obj => obj.conta == conta);
  }

  buscaPorDatas(data_from: Date, data_to: Date, contas: Conta[]): any[] {
    let gastos: any[] = [];
    contas.forEach(c => {
      let total: number = 0;
      this.listarTodos()
        .filter(obj => Date.parse(obj.data.toString()) >= data_from.valueOf() &&
                       Date.parse(obj.data.toString()) <= data_to.valueOf())
        .forEach(d => {
          if (c.nome == d.conta)
            total += d.valor;
        });
      gastos.push([c.nome, total]);
    });
    return gastos.sort((a, b) => a[1]-b[1]);
  }

  getFaturaPorDatas(data_from: Date, data_to: Date, contas: Conta[]): any[] {
    let fatura: any[] = [];
    contas.filter(b => b.tipo == 'Crédito').forEach(c => {
      this.listarTodos()
        .filter(obj => Date.parse(obj.data.toString()) >= data_from.valueOf() &&
                       Date.parse(obj.data.toString()) <= data_to.valueOf())
        .forEach(d => {
          if (c.nome == d.conta) {
            fatura.push([d.nome, d.valor]);
          }
        });
    });
    return fatura.sort((a, b) => b[1]-a[1]);
  }

  atualizar(despesa: Despesa): void {
    const despesas: Despesa[] = this.listarTodos();
    despesas.forEach((obj, index, objs) => {
      if (despesa.id == obj.id) {
        objs[index] = despesa;
      }
    });
    localStorage[this.colecao] = JSON.stringify(despesas);
    this.fire.salvarColecao(1);
  }

  remover(id: number): void {
    let lista: Despesa[] = this.listarTodos();
    lista = lista.filter(obj => obj.id != id);
    localStorage[this.colecao] = JSON.stringify(lista);
    this.fire.salvarColecao(1);
  }
}
