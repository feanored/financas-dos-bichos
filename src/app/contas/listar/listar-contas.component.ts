import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

import { Conta } from '../../shared';
import { ContaService } from '../../services/conta.service';

@Component({
  selector: 'app-listar-contas',
  templateUrl: './listar-contas.component.html',
  styleUrls: ['./listar-contas.component.css']
})
export class ListarContasComponent implements OnInit {

  constructor(
    private contaService: ContaService
    ) { }

  contas: Conta[] = [];
  mostrarNovo: boolean = false;

  @ViewChild('modal_dialog') modal: TemplateRef<any>;
  @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
  backdrop: any;
  modalTitulo: string = 'Contas';
  modalTexto: string = '';
  modalTipo: number = 1;
  data_id: number;

  ngOnInit(): void {
    this.listarTodos();
  }

  listarTodos() {
      this.contas = this.contaService.listarTodos();
      if (this.contas != null)
        this.contas = this.contas.sort(
          (a, b) => a.id - b.id);
  }

  apagar($event: any, id: number) {
    $event.preventDefault();
    if (confirm("Tem certeza que quer remover esta conta?")) {
      this.contaService.remover(id);
      this.listarTodos();
    }
  }

  alterarStatus(id: number) {
    this.data_id = id;
    this.showDialog(2, "Quer mesmo alterar o status desta conta?");
    return false;
  }

  confirmar(id: number) {
    this.contaService.alterarStatus(id);
    this.listarTodos();
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
