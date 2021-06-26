import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Categoria } from 'src/app/models/categoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-editar-categoria',
  templateUrl: './editar-categoria.component.html',
  styleUrls: ['./editar-categoria.component.css']
})
export class EditarCategoriaComponent implements OnInit {

    constructor(
      private categoriaService: CategoriaService,
      private router: Router,
      private route: ActivatedRoute
    ) { }

    @ViewChild('formCategoria', { static: true }) formCategoria: NgForm;
    categoria: Categoria;

    ngOnInit(): void {
      const id = +this.route.snapshot.params['id'];
      this.categoria = this.categoriaService.buscarPorId(id);
    }

    atualizar(): void{
      if (this.formCategoria.form.valid) {
        this.categoriaService.atualizar(this.categoria);
        this.router.navigate(['/categorias']);
      }
    }

  }
