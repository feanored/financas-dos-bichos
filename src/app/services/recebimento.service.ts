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

  getDatasInicioMes(){
    let datas = [];
    this.listarTodos().filter(z=> z.nome.includes("Salário")).forEach(x => {
      let y = new Date(x.data);
      datas.push(new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0));
    });
    return datas;
  }

  getDatasFimMes(ini: Date[]){
    let datas = [];
    if (ini.length > 1) {
      ini.slice(1).forEach(y => {
        let fim = new Date(y.getFullYear(), y.getMonth(), y.getDate()-1, 23, 59, 59);
        datas.push(fim);
      });
    }
    datas.push(new Date());
    return datas;
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
