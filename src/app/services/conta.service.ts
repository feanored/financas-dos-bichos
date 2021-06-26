import { Injectable } from '@angular/core';
import { Conta } from '../shared';
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  constructor(private fire: FireService) { }

  private colecao: string = "contas";
  public contas: Conta[] = [];

  listarTodos(): Conta[] {
    const lista = localStorage[this.colecao];
    return lista ? JSON.parse(lista): [];
  }

  cadastrar(obj: Conta): void {
    const lista = this.listarTodos();
    obj.id = new Date().getTime();
    obj.desativado = false;
    lista.push(Object.assign({}, obj));
    localStorage[this.colecao] = JSON.stringify(lista);
    this.fire.salvarColecao(0);
  }

  buscarPorId(id: number): Conta {
    const lista = this.listarTodos();
    return lista.find(obj => obj.id == id);
  }

  getById(id: number): Conta {
    return this.contas.find(obj => obj.id == id);
  }

  buscarPorNome(nome: string): Conta {
    const lista = this.listarTodos();
    return lista.find(obj => obj.nome == nome);
  }

  buscarPorTipo(tipo: string): Conta[] {
    const lista = this.listarTodos();
    let ret: Conta[] = [];
    lista.forEach(obj => {
      if (obj.tipo == tipo)
        ret.push(obj);
    });
    return ret;
  }

  atualizar(conta: Conta): void {
    conta.saldo = parseFloat(conta.saldo.toFixed(2));
    const contas = this.listarTodos();
    contas.forEach((obj, index, objs) => {
      if (conta.id == obj.id) {
        objs[index] = conta;
      }
    });
    localStorage[this.colecao] = JSON.stringify(contas);
    this.fire.salvarColecao(0);
  }

  remover(id: number): void {
    let lista = this.listarTodos();
    lista = lista.filter(obj => obj.id != id);
    localStorage[this.colecao] = JSON.stringify(lista);
    this.fire.salvarColecao(0);
  }

  alterarStatus(id: number): void {
    const contas = this.listarTodos();
    contas.forEach((obj, index, objs) => {
      if (id == obj.id) {
        objs[index].desativado = !obj.desativado;
      }
    });
    localStorage[this.colecao] = JSON.stringify(contas);
    this.fire.salvarColecao(0);
  }
}
