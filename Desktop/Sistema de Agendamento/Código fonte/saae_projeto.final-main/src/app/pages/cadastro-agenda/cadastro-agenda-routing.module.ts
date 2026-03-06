import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroAgendaPage } from './cadastro-agenda.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroAgendaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroAgendaPageRoutingModule {}
