import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Conta } from '../../shared';
import { ContaService } from '../../services/conta.service';

@Component({
  selector: 'app-cadastrar-conta',
  templateUrl: './cadastrar-conta.component.html',
  styleUrls: ['./cadastrar-conta.component.css']
})
export class CadastrarContaComponent implements OnInit {

  constructor(
    private contaService: ContaService,
    private router: Router
  ) { }

  @ViewChild('formConta', { static: true }) formConta: NgForm;
  tipos: string[] = [];
  conta: Conta;

  ngOnInit(): void {
    this.conta = new Conta();
    this.tipos = ['Débito', 'Crédito'];
  }

  cadastrar(): void {
    if (this.formConta.form.valid) {
      this.contaService.cadastrar(this.conta);
      this.router.navigate(["/contas"]);
    }
  }

}
