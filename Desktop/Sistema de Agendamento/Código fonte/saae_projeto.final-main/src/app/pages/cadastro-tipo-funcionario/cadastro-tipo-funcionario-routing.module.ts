import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroTipoFuncionarioPage } from './cadastro-tipo-funcionario.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroTipoFuncionarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroTipoFuncionarioPageRoutingModule {}
