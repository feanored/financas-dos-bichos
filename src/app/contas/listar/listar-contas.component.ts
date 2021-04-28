import { Component, OnInit } from '@angular/core';

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
    if (confirm("Quer mesmo alterar o status desta conta?")) {
      this.contaService.alterarStatus(id);
      this.listarTodos();
    } else return false;
  }

}
