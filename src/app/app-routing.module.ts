import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalRoutes } from './principal';
import { ContaRoutes } from './contas';
import { DespesaRoutes } from './despesas';
import { RecebimentoRoutes } from './recebimentos';
import { CategoriasRoutes } from './categorias';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/principal',
    pathMatch: 'full'
  },
  ...PrincipalRoutes,
  ...ContaRoutes,
  ...DespesaRoutes,
  ...RecebimentoRoutes,
  ...CategoriasRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
