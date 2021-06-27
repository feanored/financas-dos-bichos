import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContaService } from 'src/app/contas';

import { Despesa } from '../../shared';
import { DespesaService } from '../../services/despesa.service';
import { CategoriaService } from 'src/app/categorias';

interface Filtro {
  nome: string;
  conta: string;
  categoria: string;
}

@Component({
  selector: 'app-listar-despesas',
  templateUrl: './listar-despesas.component.html',
  styleUrls: ['./listar-despesas.component.css']
})
export class ListarDespesasComponent implements OnInit {

  constructor(
    private despesaService: DespesaService,
    public contaService: ContaService,
    public categoriaService: CategoriaService
    ) { }

  @ViewChild('formFiltroNome', { static: true }) formFiltroNome: NgForm;
  @ViewChild('formFiltroConta', { static: true }) formFiltroConta: NgForm;
  @ViewChild('formFiltroCat', { static: true }) formFiltroCat: NgForm;
  despesas: Despesa[] = [];
  filtro: Filtro;
  total: number;
  data_from: Date;
  data_to: Date;

  @ViewChild('modal_dialog') modal: TemplateRef<any>;
  @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
  backdrop: any;
  modalTitulo: string = 'Despesas';
  modalTexto: string = '';
  modalTipo: number = 1;
  data_id: number;

  ngOnInit(): void {
    this.categoriaService.categorias = this.categoriaService.listarTodos().sort(function (a, b) {
      return ('' + a.nome).localeCompare(b.nome);
    });
    this.contaService.contas = this.contaService.listarTodos().filter(z => !z.desativado);
    // recupera filtros
    const filtros = localStorage['filtros_graficos'] ?
      JSON.parse(localStorage['filtros_graficos']) : null;
    if (filtros) {
      this.data_from = new Date(filtros.data_from);
      this.data_to = new Date(filtros.data_to);
    } else {
      this.data_from = this.despesaService.getDataMin();
      this.data_to = new Date();
    }
    this.filtro = {nome:'', conta:'', categoria: ''};
    if (sessionStorage['filtro_despesas']) {
      const filtros_salvos = JSON.parse(sessionStorage['filtro_despesas']);
      this.filtro.nome = filtros_salvos.nome;
      this.filtro.conta = filtros_salvos.conta;
      this.filtro.categoria = filtros_salvos.categoria;
    }
    this.total = 0;
    this.filtrar();
  }

  listarTodos(): Despesa[] {
    const lista = this.despesaService.listarTodos();
    if (lista.length > 0)
      return lista.sort((a, b) => <any>new Date(b.data) - <any>new Date(a.data));
    return [];
  }

  filtrar(): void {
    this.despesas = this.listarTodos().filter(z =>
      z.nome.toLowerCase().includes(this.filtro.nome.toLowerCase()) &&
      Date.parse(z.data.toString()) >= this.data_from.valueOf() &&
      Date.parse(z.data.toString()) <= this.data_to.valueOf());
    // adicionar filtros adicionais on-demand
    if (this.filtro.conta != "") {
      this.despesas = this.despesas.filter(z => z.conta === this.filtro.conta);
    }
    if (this.filtro.categoria !== "") {
      this.despesas = this.despesas.filter(z => z.categoria === this.filtro.categoria);
    }
    this.total = 0;
    this.despesas.forEach(obj => this.total += obj.valor);
    // salvar os filtros na sessao atual
    sessionStorage['filtro_despesas'] = JSON.stringify({
      'nome':this.filtro.nome, 'conta':this.filtro.conta, 'categoria':this.filtro.categoria});
  }

  limparFiltro(op: number): void {
    if (op == 1)
      this.filtro.nome = "";
    else if (op == 2)
      this.filtro.conta = "";
    else if (op == 3)
      this.filtro.categoria = "";
    this.filtrar();
  }

  getCategoria(id: string): string {
    if (id === null) return "-";
    const cat = this.categoriaService.getById(parseInt(id));
    return cat !== undefined ? cat.nome : '-';
  }

  getConta(id: string): string {
    if (id === null) return "-";
    const cat = this.contaService.getById(parseInt(id));
    return cat !== undefined ? cat.nome : '-';
  }

  apagar($event: any, id: number) {
    $event.preventDefault();
    this.data_id = id;
    this.showDialog(2, "Tem certeza que quer remover esta despesa?");
  }

  confirmar(id: number) {
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
