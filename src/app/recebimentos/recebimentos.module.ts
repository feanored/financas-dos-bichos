import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RecebimentoService } from '../services/recebimento.service';
import { ListarRecebimentosComponent } from './listar';
import { CadastrarRecebimentoComponent } from './cadastrar';
import { EditarRecebimentoComponent } from './editar';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTooltipModule
  ],
  declarations: [
    ListarRecebimentosComponent,
    CadastrarRecebimentoComponent,
    EditarRecebimentoComponent
  ],
  providers: [
    RecebimentoService
  ]
})

export class RecebimentosModule { }
