import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ContaService } from '../services/conta.service';
import { ListarContasComponent } from './listar';
import { CadastrarContaComponent } from './cadastrar';
import { EditarContaComponent } from './editar';
import { ContaDesativadaDirective } from './conta-desativada.directive';
import { TransferirComponent } from './transferir/transferir.component';
import { ListarTransferenciasComponent } from './listar-transferencias/listar-transferencias.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    ListarContasComponent,
    CadastrarContaComponent,
    EditarContaComponent,
    ContaDesativadaDirective,
    TransferirComponent,
    ListarTransferenciasComponent
  ],
  providers: [
    ContaService
  ]
})

export class ContasModule { }
