import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Categoria } from 'src/app/models/categoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-listar-categorias',
  templateUrl: './listar-categorias.component.html',
  styleUrls: ['./listar-categorias.component.css']
})
export class ListarCategoriasComponent implements OnInit {

  constructor(
    private categoriaService: CategoriaService
    ) { }

  categorias: Categoria[] = [];

  @ViewChild('modal_dialog') modal: TemplateRef<any>;
  @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
  backdrop: any;
  modalTitulo: string = 'Categorias';
  modalTexto: string = '';
  modalTipo: number = 1;
  data_id: number;

  ngOnInit(): void {
    this.categorias = this.listarTodos();
  }

  listarTodos(): Categoria[] {
    const lista = this.categoriaService.listarTodos();
    if (lista.length > 0)
      return lista.sort((a, b) => a.nome > b.nome ? 1 : -1);
    return [];
  }

  apagar($event: any, id: number) {
    $event.preventDefault();
    this.data_id = id;
    this.showDialog(2, "Tem certeza que quer remover esta categoria?");
  }

  confirmar(id: number) {
    this.categoriaService.remover(id);
    this.categorias = this.listarTodos();
  }

  showDialog(tipo: number, texto: string){
    this.modalTipo = tipo;
    this.modalTexto = texto;
    let view = this.modal.createEmbeddedView(null);
    this.vc.insert(view);
    this.modal.elementRef.nativeElement.previousElementSibling.classList.remove('fade');
    this.modal.elementRef.nativeElement.previousElementSibling.classList.add('modal-open');
    this.modal.elementRef.nativeElement.previousElementSibling.style.display = 'block';
    this.backdrop = document.createElement('DIV');
    this.backdrop.className = 'modal-backdrop';
    this.backdrop.style.opacity = 0.6;
    document.body.appendChild(this.backdrop);
  }

  closeDialog() {
    this.vc.clear();
    this.backdrop.parentNode.removeChild(this.backdrop);
  }

}
