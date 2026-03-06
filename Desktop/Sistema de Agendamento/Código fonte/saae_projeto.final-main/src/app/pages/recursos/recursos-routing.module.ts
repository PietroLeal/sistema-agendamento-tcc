import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecursosPage } from './recursos.page';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./recursos.page').then(m => m.RecursosPage)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecursosPageRoutingModule {}
