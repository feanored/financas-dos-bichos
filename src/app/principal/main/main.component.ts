import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContaService } from 'src/app/contas';
import { DespesaService } from 'src/app/despesas';
import { Conta } from 'src/app/shared';

declare var google: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild('formFiltro', { static: true }) formFiltro: NgForm;
  data_from: Date;
  data_to: Date;
  contas: Conta[];
  contasChart: any[];
  cartoesChart: any[];
  despesas: any[];
  faturas: any[];
  hiddenMsg: boolean = true;

  constructor(
    private contaService: ContaService,
    private despesaService: DespesaService)
  {
    this.contasChart = [];
    this.cartoesChart = [];
    this.despesas = [];
    this.faturas = [];
   }

  ngOnInit(): void {
    const filtros = localStorage['filtros_graficos'] ?
      JSON.parse(localStorage['filtros_graficos']) : null;
    if (filtros) {
      this.data_from = new Date(filtros.data_from);
      this.data_to = new Date(filtros.data_to);
    } else {
      this.data_from = this.despesaService.getDataMin();
      this.data_to = new Date();
    }
    this.contas = this.contaService.listarTodos().filter(obj => !obj.desativado);
    this.contas.forEach(obj => {
      if (obj.tipo == 'Débito') {
        this.contasChart.push([obj.nome, obj.saldo, obj.saldo,
          obj.saldo < 0 ? '#DC3912': '#3366CC']);
      } else if (obj.tipo == 'Crédito') {
        this.cartoesChart.push([obj.nome, obj.saldo, obj.saldo, '#990099']);
      }
    });
    this.filtrar(false);
    this.initGoogle();
  }

  filtrar(update: boolean): void {
    if (this.data_from != null && this.data_to != null) {
      this.despesas = this.despesaService.buscaPorDatas(this.data_from, this.data_to, this.contas);
      this.faturas = this.despesaService.getFaturaPorDatas(this.data_from, this.data_to, this.contas);
      if (update) {
        localStorage['filtros_graficos'] = JSON.stringify({
          "data_from": this.data_from,
          "data_to": this.data_to
        });
        this.exibirGraficos();
      }
    }
  }

  initGoogle(): void{
    if (typeof(google) !== 'undefined') {
      google.charts.load('current', {'packages':['corechart']});
      setTimeout(() => {
        google.charts.setOnLoadCallback(this.exibirGraficos());
        this.hiddenMsg = false;
      }, 500);
    }
  }

  exibirGraficos(): void {
    let config_despesas = {
      title: 'Gastos por conta: '+this.obterTotalDespesas(),
      width: 600,
      height: 350,
      is3D: true,
      pieSliceText: 'value',
      backgroundColor: 'transparent',
      titleTextStyle: {
        color: 'navy',
        fontName: 'FF Tisa Sans Pro',
        fontSize: 14,
        bold: true,
      }
    };
    const el_1 = document.getElementById('pie_despesas');
    const chart_1 = new google.visualization.PieChart(el_1);
    chart_1.draw(this.obterDadosDespesas(), config_despesas);

    let config_faturas = {
      title: 'Compras dos cartões: '+this.obterTotalFaturas(),
      width: 600,
      height: 350,
      pieHole: 0.33,
      pieSliceText: 'value',
      backgroundColor: 'transparent',
      titleTextStyle: {
        color: 'navy',
        fontName: 'FF Tisa Sans Pro',
        fontSize: 14,
        bold: true,
      }
    };
    const el_3 = document.getElementById('pie_faturas');
    const chart_3 = new google.visualization.PieChart(el_3);
    chart_3.draw(this.obterDadosFaturas(), config_faturas);

    let config_contas = {
      title: 'Saldo das contas: '+this.obterTotalContas(),
      width: 525,
      height: 350,
      bar: {groupWidth: "80%"},
      legend: { position: "none" },
      backgroundColor: 'transparent',
      titleTextStyle: {
        color: 'navy',
        fontName: 'FF Tisa Sans Pro',
        fontSize: 14,
        bold: true,
      }
    };
    const el_2 = document.getElementById('pie_contas');
    const chart_2 = new google.visualization.ColumnChart(el_2);
    chart_2.draw(this.obterDadosContas(), config_contas);

    let config_cartoes = {
      title: 'Fatura dos cartões: '+this.obterTotalCartoes(),
      width: 525,
      height: 350,
      bar: {groupWidth: "40%"},
      legend: { position: "none" },
      backgroundColor: 'transparent',
      titleTextStyle: {
        color: 'navy',
        fontName: 'FF Tisa Sans Pro',
        fontSize: 14,
        bold: true,
      }
    };
    const el_4 = document.getElementById('pie_cartoes');
    const chart_4 = new google.visualization.ColumnChart(el_4);
    chart_4.draw(this.obterDadosCartoes(), config_cartoes);
  }

  obterDadosDespesas(): any {
    const dados = new google.visualization.DataTable();
    dados.addColumn('string', 'Conta');
    dados.addColumn('number', 'Gastos no período');
    dados.addRows(this.despesas);
    return dados;
  }

  obterTotalDespesas(): string {
    let total = 0;
    this.despesas.forEach(z => total += z[1]);
    return 'R$ '+total.toFixed(2);
  }

  obterDadosFaturas(): any {
    const dados = new google.visualization.DataTable();
    dados.addColumn('string', 'Compra');
    dados.addColumn('number', 'Valor');
    dados.addRows(this.faturas);
    return dados;
  }

  obterTotalFaturas(): string {
    let total = 0;
    this.faturas.forEach(z => total += z[1]);
    return 'R$ '+total.toFixed(2);
  }

  obterDadosContas(): any {
    const dados = new google.visualization.DataTable();
    dados.addColumn('string', 'Conta');
    dados.addColumn('number', 'Saldo atual');
    dados.addColumn({type:'number', role:'annotation'});
    dados.addColumn({type:'string', role:'style'});
    dados.addRows(this.contasChart);
    return dados;
  }

  obterTotalContas(): string {
    let total = 0;
    this.contasChart.forEach(z => total += z[1]);
    return 'R$ '+total.toFixed(2);
  }

  obterDadosCartoes(): any {
    const dados = new google.visualization.DataTable();
    dados.addColumn('string', 'Cartão');
    dados.addColumn('number', 'Fatura atual');
    dados.addColumn({type:'number', role:'annotation'});
    dados.addColumn({type:'string', role:'style'});
    dados.addRows(this.cartoesChart);
    return dados;
  }

  obterTotalCartoes(): string {
    let total = 0;
    this.cartoesChart.forEach(z => total += z[1]);
    return 'R$ '+total.toFixed(2);
  }

}
