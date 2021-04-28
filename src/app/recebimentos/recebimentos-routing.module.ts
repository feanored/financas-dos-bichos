import { Routes } from '@angular/router';
import { CadastrarRecebimentoComponent } from './cadastrar';
import { EditarRecebimentoComponent } from './editar';
import { ListarRecebimentosComponent } from './listar';

export const RecebimentoRoutes: Routes = [
  {
    path: 'pagamentos',
    component: ListarRecebimentosComponent
  },
  {
    path: 'pagamentos/cadastrar',
    component: CadastrarRecebimentoComponent
  },
  {
    path: 'pagamentos/editar/:id',
    component: EditarRecebimentoComponent
  }
];
