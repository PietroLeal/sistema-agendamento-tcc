import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaSalasPage } from './consulta-salas.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaSalasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaSalasPageRoutingModule {}
