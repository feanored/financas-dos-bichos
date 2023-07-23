import { Routes } from '@angular/router';
import { CadastrarRecebimentoComponent } from './cadastrar';
import { EditarRecebimentoComponent } from './editar';
import { ListarRecebimentosComponent } from './listar';

export const RecebimentoRoutes: Routes = [
  {
    path: 'receitas',
    component: ListarRecebimentosComponent
  },
  {
    path: 'receitas/cadastrar',
    component: CadastrarRecebimentoComponent
  },
  {
    path: 'receitas/editar/:id',
    component: EditarRecebimentoComponent
  }
];
