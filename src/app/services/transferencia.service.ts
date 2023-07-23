import { Injectable } from '@angular/core';
import { Transferencia, FireService } from '../shared';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  constructor(private fire: FireService) { }

  private colecao: string = "transferencias";

  listarTodos(): Transferencia[] {
    const lista = localStorage[this.colecao];
    return lista ? JSON.parse(lista): [];
  }

  cadastrar(obj: Transferencia): void {
    const lista = this.listarTodos();
    obj.id = new Date().getTime();
    lista.push(obj);
    localStorage[this.colecao] = JSON.stringify(lista);
    this.fire.salvarColecao(4);
  }

  buscarPorId(id: number): Transferencia {
    const lista: Transferencia[] = this.listarTodos();
    return lista.find(obj => obj.id == id);
  }

  buscarPorOrigem(origem: string): Transferencia[] {
    const lista: Transferencia[] = this.listarTodos();
    return lista.filter(obj => obj.origem == origem);
  }

  buscarPorDestino(origem: string): Transferencia[] {
    const lista: Transferencia[] = this.listarTodos();
    return lista.filter(obj => obj.origem == origem);
  }

  atualizar(transferencia: Transferencia): void {
    const transferencias: Transferencia[] = this.listarTodos();
    transferencias.forEach((obj, index, objs) => {
      if (transferencia.id == obj.id) {
        objs[index] = transferencia;
      }
    });
    localStorage[this.colecao] = JSON.stringify(transferencias);
    this.fire.salvarColecao(4);
  }

  remover(id: number): void {
    let lista: Transferencia[] = this.listarTodos();
    lista = lista.filter(obj => obj.id != id);
    localStorage[this.colecao] = JSON.stringify(lista);
    this.fire.salvarColecao(4);
  }
}
