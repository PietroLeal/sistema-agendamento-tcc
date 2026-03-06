import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroTipoSalaPage } from './cadastro-tipo-sala.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroTipoSalaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroTipoSalaPageRoutingModule {}
