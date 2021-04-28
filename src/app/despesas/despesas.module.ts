import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DespesaService } from '../services/despesa.service';
import { ListarDespesasComponent } from './listar';
import { CadastrarDespesaComponent } from './cadastrar';
import { EditarDespesaComponent } from './editar';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTooltipModule
  ],
  declarations: [
    ListarDespesasComponent,
    CadastrarDespesaComponent,
    EditarDespesaComponent
  ],
  providers: [
    DespesaService
  ]
})

export class DespesasModule { }
