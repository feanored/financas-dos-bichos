import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ContaService } from '../../services/conta.service';

interface Transferir{
  conta_from: string;
  conta_to: string;
  valor: number;
}

@Component({
  selector: 'app-transferir',
  templateUrl: './transferir.component.html',
  styleUrls: ['./transferir.component.css']
})
export class TransferirComponent implements OnInit {

  constructor(
    private contaService: ContaService,
    private router: Router
    ) { }

  @ViewChild('formTransferir', { static: true }) formTransferir: NgForm;
  contas: string[] = [];
  contas_to: string[] = [];
  contas_to_aux: string[] = [];
  transferir: Transferir;

  @ViewChild('modal_dialog') modal: TemplateRef<any>;
  @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
  backdrop: any;
  modalTitulo: string = 'Transferência entre contas';
  modalTexto: string = '';
  modalTipo: number = 1;

  ngOnInit(): void {
    this.transferir = {conta_from:'', conta_to:'', valor:null};

    // obter as contas para seleção
    this.contaService.listarTodos().forEach(obj => {
      if (!obj.desativado && obj.tipo == 'Débito' && !obj.nome.includes('Ticket'))
        this.contas.push(obj.nome);
    });
    this.contaService.listarTodos().forEach(obj => {
      if (!obj.desativado && !obj.nome.includes('Ticket'))
        this.contas_to_aux.push(obj.nome);
    });
  }

  filtrar(option: string): void {
    this.transferir.conta_to = '';
    this.contas_to = this.contas_to_aux.filter(z => z != option);
  }

  validarValor(valor: number): void {
    if (+valor <= 0)
      this.transferir.valor = null;
  }

  pedirConfirmacao() {
    this.showDialog(2, 'Confirma esta transferência?');
  }

  confirmar(): void {
    if (this.formTransferir.form.valid) {
      let conta_from = this.contaService.buscarPorNome(this.transferir.conta_from);
      let conta_to = this.contaService.buscarPorNome(this.transferir.conta_to);
      conta_from.saldo -= this.transferir.valor;
      if (conta_to.tipo == 'Débito')
        conta_to.saldo += this.transferir.valor;
      else
        conta_to.saldo -= this.transferir.valor;
      this.contaService.atualizar(conta_from);
      this.contaService.atualizar(conta_to);
      this.showDialog(1, 'Transferência realizada com sucesso!');
    }
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

  closeDialog(redirect: boolean = false) {
    this.vc.clear();
    this.backdrop.parentNode.removeChild(this.backdrop);
    if (redirect) this.router.navigate(["/contas"]);
  }

}
