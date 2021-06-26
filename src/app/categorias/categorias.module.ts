import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ListarCategoriasComponent } from './listar';
import { CadastrarCategoriaComponent } from './cadastrar';
import { EditarCategoriaComponent } from './editar';
import { CategoriaService } from '../services/categoria.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    ListarCategoriasComponent,
    CadastrarCategoriaComponent,
    EditarCategoriaComponent
  ],
  providers: [
    CategoriaService
  ]
})

export class CategoriasModule { }
