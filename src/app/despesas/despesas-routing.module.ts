import { Routes } from '@angular/router';
import { CadastrarDespesaComponent } from './cadastrar';
import { EditarDespesaComponent } from './editar';
import { ListarDespesasComponent } from './listar';

export const DespesaRoutes: Routes = [
  {
    path: 'despesas',
    component: ListarDespesasComponent
  },
  {
    path: 'despesas/cadastrar',
    component: CadastrarDespesaComponent
  },
  {
    path: 'despesas/editar/:id',
    component: EditarDespesaComponent
  }
];
