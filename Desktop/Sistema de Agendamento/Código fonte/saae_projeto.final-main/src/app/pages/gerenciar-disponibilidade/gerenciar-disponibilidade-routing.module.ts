import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GerenciarDisponibilidadePage } from './gerenciar-disponibilidade.page';

const routes: Routes = [
  {
    path: '',
    component: GerenciarDisponibilidadePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GerenciarDisponibilidadePageRoutingModule {}
