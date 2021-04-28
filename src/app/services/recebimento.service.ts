import { Injectable } from '@angular/core';
import { Recebimento, FireService } from '../shared';

@Injectable({
  providedIn: 'root'
})
export class RecebimentoService {

  constructor(private fire: FireService) { }

  private colecao: string = "recebimentos";

  listarTodos(): Recebimento[] {
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

  cadastrar(obj: Recebimento): void {
    const lista = this.listarTodos();
    obj.id = new Date().getTime();
    lista.push(obj);
    localStorage[this.colecao] = JSON.stringify(lista);
    this.fire.salvarColecao(2);
  }

  buscarPorId(id: number): Recebimento {
    const lista: Recebimento[] = this.listarTodos();
    return lista.find(obj => obj.id == id);
  }

  buscarPorConta(conta: string): Recebimento[] {
    const lista: Recebimento[] = this.listarTodos();
    return lista.filter(obj => obj.conta == conta);
  }

  atualizar(recebimento: Recebimento): void {
    const recebimentos: Recebimento[] = this.listarTodos();
    recebimentos.forEach((obj, index, objs) => {
      if (recebimento.id == obj.id) {
        objs[index] = recebimento;
      }
    });
    localStorage[this.colecao] = JSON.stringify(recebimentos);
    this.fire.salvarColecao(2);
  }

  remover(id: number): void {
    let lista: Recebimento[] = this.listarTodos();
    lista = lista.filter(obj => obj.id != id);
    localStorage[this.colecao] = JSON.stringify(lista);
    this.fire.salvarColecao(2);
  }
}
