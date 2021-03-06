import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoriaService } from 'src/app/categorias';
import { ContaService } from 'src/app/contas';
import { DespesaService } from 'src/app/despesas';
import { Categoria } from 'src/app/models/categoria.model';
import { RecebimentoService } from 'src/app/recebimentos';
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
  categorias: Categoria[];
  contasChart: any[] = [];
  cartoesChart: any[] = [];
  despesasPorConta: any[] = [];
  despesasPorCategoria: any[] = [];
  faturas: any[] = [];
  mesesHistorico: any;
  hiddenMsg: boolean = true;
  mes: string[] = [
    "Jan", "Fev", "Mar",
    "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set",
    "Out", "Nov", "Dez"
  ];

  constructor(
    private contaService: ContaService,
    private categoriaService: CategoriaService,
    private despesaService: DespesaService,
    private recebimentoService: RecebimentoService)
  { }

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
    this.categorias = this.categoriaService.listarTodos();
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

  geraMesesHistorico() {
    const inicios = this.recebimentoService.getDatasInicioMes();
    const finais = this.recebimentoService.getDatasFimMes(inicios);
    const meses = finais.map(z => z.getMonth());
    if (meses.length > 1 && meses[meses.length-1] === meses[meses.length-2]) {
      meses[meses.length-1] = meses[meses.length-2] < 11 ? meses[meses.length-2]+1 : 0;
    }
    this.mesesHistorico = new google.visualization.DataTable();
    this.mesesHistorico.addColumn('string', 'Mês');
    this.contas.forEach(z => {
      this.mesesHistorico.addColumn('number', z.nome);
    });
    for (let i=0; i < meses.length; i++) {
      let totais = [];
      this.contas.forEach(z => {
        totais.push(this.despesaService.getPorContaEDatas(inicios[i], finais[i], z.nome));
      });
      this.mesesHistorico.addRow([this.mes[meses[i]], ...totais]);
    }
  }

  filtrar(update: boolean): void {
    if (this.data_from != null && this.data_to != null) {
      this.despesasPorConta = this.despesaService.agrupaPorConta(this.data_from, this.data_to, this.contas);
      this.despesasPorCategoria = this.despesaService.agrupaPorCategoria(this.data_from, this.data_to, this.categorias);
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
      google.charts.load('current', {packages:['corechart', 'line']});
      setTimeout(() => {
        this.geraMesesHistorico();
        google.charts.setOnLoadCallback(this.exibirGraficos());
        this.hiddenMsg = false;
      }, 500);
    }
  }

  exibirGraficos(): void {
    const el_1 = document.getElementById('pie_despesas');
    const chart_1 = new google.visualization.PieChart(el_1);
    chart_1.draw(this.obterDadosDespesas(), {
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
    });

    const el_5 = document.getElementById('pie_categorias');
    const chart_5 = new google.visualization.PieChart(el_5);
    chart_5.draw(this.obterDadosCategorias(), {
      title: 'Gastos por categoria: '+this.obterTotalDespesas(),
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
    });

    const el_3 = document.getElementById('pie_faturas');
    const chart_3 = new google.visualization.PieChart(el_3);
    chart_3.draw(this.obterDadosFaturas(), {
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
    });
    const width = (this.contasChart.length*20).toString() + '%';

    const el_2 = document.getElementById('pie_contas');
    const chart_2 = new google.visualization.ColumnChart(el_2);
    chart_2.draw(this.obterDadosContas(), {
      title: 'Saldo das contas: '+this.obterTotalContas(),
      width: 525,
      height: 350,
      vAxis: {minValue: 0},
      bar: {groupWidth: width},
      legend: { position: "none" },
      backgroundColor: 'transparent',
      titleTextStyle: {
        color: 'navy',
        fontName: 'FF Tisa Sans Pro',
        fontSize: 14,
        bold: true,
      }
    });

    const el_4 = document.getElementById('pie_cartoes');
    const chart_4 = new google.visualization.ColumnChart(el_4);
    chart_4.draw(this.obterDadosCartoes(), {
      title: 'Fatura dos cartões: '+this.obterTotalCartoes(),
      width: 525,
      height: 350,
      vAxis: {minValue: 0},
      bar: {groupWidth: "40%"},
      legend: { position: "none" },
      backgroundColor: 'transparent',
      titleTextStyle: {
        color: 'navy',
        fontName: 'FF Tisa Sans Pro',
        fontSize: 14,
        bold: true,
      }
    });

    const chart_6 = new google.visualization.LineChart(document.getElementById('pie_historico'));
    chart_6.draw(this.mesesHistorico, /*google.charts.Line.convertOptions(*/{
      title: 'Histórico de gastos por conta',
      width: 550,
      height: 350,
      axes: {
        x: {
          0: {label: ''}
        }
      },
      backgroundColor: 'transparent',
      titleTextStyle: {
        color: 'navy',
        fontName: 'FF Tisa Sans Pro',
        fontSize: 14,
        bold: true,
      },
      chartArea: {width: '55%'}
    });
  }

  obterDadosDespesas(): any {
    const dados = new google.visualization.DataTable();
    dados.addColumn('string', 'Conta');
    dados.addColumn('number', 'Gastos no período');
    dados.addRows(this.despesasPorConta);
    return dados;
  }

  obterDadosCategorias(): any {
    const dados = new google.visualization.DataTable();
    dados.addColumn('string', 'Categoria');
    dados.addColumn('number', 'Gastos no período');
    dados.addRows(this.despesasPorCategoria);
    return dados;
  }

  obterTotalDespesas(): string {
    let total = 0;
    this.despesasPorConta.forEach(z => total += z[1]);
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
