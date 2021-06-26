import { Routes } from '@angular/router';
import { CadastrarCategoriaComponent } from './cadastrar';
import { EditarCategoriaComponent } from './editar';
import { ListarCategoriasComponent } from './listar';

export const CategoriasRoutes: Routes = [
  {
    path: 'categorias',
    component: ListarCategoriasComponent
  },
  {
    path: 'categorias/cadastrar',
    component: CadastrarCategoriaComponent
  },
  {
    path: 'categorias/editar/:id',
    component: EditarCategoriaComponent
  }
];
