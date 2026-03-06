import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CadastroReservaPage } from './cadastro-reserva.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroReservaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroReservaPageRoutingModule {}
