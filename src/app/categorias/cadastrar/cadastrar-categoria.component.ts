import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Categoria } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-cadastrar-categoria',
  templateUrl: './cadastrar-categoria.component.html',
  styleUrls: ['./cadastrar-categoria.component.css']
})
export class CadastrarCategoriaComponent implements OnInit {

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  @ViewChild('formCategoria', { static: true }) formCategoria: NgForm;
  categoria: Categoria;

  ngOnInit(): void {
    this.categoria = new Categoria();
  }

  cadastrar(): void {
    if (this.formCategoria.form.valid) {
      this.categoriaService.cadastrar(this.categoria);
      this.router.navigate(["/categorias"]);
    }
  }

}
