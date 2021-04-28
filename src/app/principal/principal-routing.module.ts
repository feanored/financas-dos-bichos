import { Routes } from '@angular/router';
import { MainComponent } from './main';

export const PrincipalRoutes: Routes = [
  {
    path: 'principal',
    component: MainComponent
  },
  {
    path: 'principal/main',
    redirectTo: 'principal'
  }
];
