import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinhasReservasPage } from './minhas-reservas.page';

const routes: Routes = [
  {
    path: '',
    component: MinhasReservasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinhasReservasPageRoutingModule {}
