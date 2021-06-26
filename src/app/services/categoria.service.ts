import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoria.model';
import { FireService } from '../shared';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private fire: FireService) { }

  private colecao: string = "categorias";
  public categorias: Categoria[] = [];

  listarTodos(): Categoria[] {
    const lista = localStorage[this.colecao];
    return lista ? JSON.parse(lista): [];
  }

  cadastrar(obj: Categoria): void {
    const lista = this.listarTodos();
    obj.id = new Date().getTime();
    lista.push(obj);
    localStorage[this.colecao] = JSON.stringify(lista);
    this.fire.salvarColecao(3);
  }

  buscarPorId(id: number): Categoria {
    const lista: Categoria[] = this.listarTodos();
    return lista.find(obj => obj.id == id);
  }

  getById(id: number): Categoria {
    return this.categorias.find(obj => obj.id == id);
  }

  atualizar(item: Categoria): void {
    const lista: Categoria[] = this.listarTodos();
    lista.forEach((obj, index, objs) => {
      if (item.id == obj.id) {
        objs[index] = item;
      }
    });
    localStorage[this.colecao] = JSON.stringify(lista);
    this.fire.salvarColecao(3);
  }

  remover(id: number): void {
    let lista: Categoria[] = this.listarTodos();
    lista = lista.filter(obj => obj.id != id);
    localStorage[this.colecao] = JSON.stringify(lista);
    this.fire.salvarColecao(3);
  }
}
