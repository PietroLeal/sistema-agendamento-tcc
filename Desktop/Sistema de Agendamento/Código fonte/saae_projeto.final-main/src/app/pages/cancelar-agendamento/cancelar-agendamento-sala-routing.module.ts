import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancelarAgendamentoPage } from './cancelar-agendamento.page';

const routes: Routes = [
  {
    path: '',
    component: CancelarAgendamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancelarAgendamentoPageRoutingModule {}
