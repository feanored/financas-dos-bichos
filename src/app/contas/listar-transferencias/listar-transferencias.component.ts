import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ContaService } from '..';
import { Transferencia } from '../../shared';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { RecebimentoService } from 'src/app/recebimentos';

interface Filtro {
  origem: string;
  destino: string;
}

@Component({
  selector: 'app-listar-transferencias',
  templateUrl: './listar-transferencias.component.html',
  styleUrls: ['./listar-transferencias.component.css']
})
export class ListarTransferenciasComponent implements OnInit {

  constructor(
    private transferenciaService: TransferenciaService,
    private recebimentoService: RecebimentoService,
    public contaService: ContaService
  ) { }

  @ViewChild('formFiltroOrigem', { static: true }) formFiltroOrigem: NgForm;
  @ViewChild('formFiltroDestino', { static: true }) formFiltroDestino: NgForm;
  transferencias: Transferencia[] = [];
  filtro: Filtro;
  data_from: Date;
  data_to: Date;

  ngOnInit(): void {
    this.contaService.contas = this.contaService.listarTodos().filter(z => !z.desativado);
    // recupera filtros
    const filtros = localStorage['filtros_graficos'] ?
      JSON.parse(localStorage['filtros_graficos']) : null;
    if (filtros) {
      this.data_from = new Date(filtros.data_from);
      this.data_to = new Date(filtros.data_to);
    } else {
      this.data_from = this.recebimentoService.getDataMin();
      this.data_to = new Date();
    }
    this.filtro = {origem:'', destino:''};
    if (sessionStorage['filtro_transferencias']) {
      const filtros_salvos = JSON.parse(sessionStorage['filtro_transferencias']);
      this.filtro.origem = filtros_salvos.origem;
      this.filtro.destino = filtros_salvos.destino;
    }
    this.filtrar();
  }

  listarTodos(): Transferencia[] {
    const lista = this.transferenciaService.listarTodos();
    if (lista.length > 0)
      return lista.sort((a, b) => <any>new Date(b.data) - <any>new Date(a.data));
    return [];
  }

  filtrar(): void {
    this.transferencias = this.listarTodos().filter(z =>
      z.origem.toLowerCase().includes(this.filtro.origem.toLowerCase()) &&
      z.destino.toLowerCase().includes(this.filtro.destino.toLowerCase()) &&
      Date.parse(z.data.toString()) >= this.data_from.valueOf() &&
      Date.parse(z.data.toString()) <= this.data_to.valueOf());
    // salvar os filtros na sessao atual
    sessionStorage['filtro_transferencias'] = JSON.stringify({
      'origem':this.filtro.origem, 'destino':this.filtro.destino});
  }

  limparFiltro(op: number): void {
    if (op == 1)
      this.filtro.origem = "";
    else if (op == 2)
      this.filtro.destino = "";
    this.filtrar();
  }

}
