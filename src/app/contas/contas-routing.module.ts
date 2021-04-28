import { Routes } from '@angular/router';
import { ListarContasComponent } from './listar';
import { CadastrarContaComponent } from './cadastrar';
import { EditarContaComponent } from './editar';
import { TransferirComponent } from './transferir';

export const ContaRoutes: Routes = [
  {
    path: 'contas',
    component: ListarContasComponent
  },
  {
    path: 'contas/cadastrar',
    component: CadastrarContaComponent
  },
  {
    path: 'contas/editar/:id',
    component: EditarContaComponent
  },
  {
    path: 'contas/transferir',
    component: TransferirComponent
  }
];
