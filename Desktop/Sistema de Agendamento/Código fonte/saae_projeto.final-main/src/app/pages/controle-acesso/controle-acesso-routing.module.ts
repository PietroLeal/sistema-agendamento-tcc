import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControleAcessoPage } from './controle-acesso.page';

const routes: Routes = [
  {
    path: '',
    component: ControleAcessoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControleAcessoPageRoutingModule {}
