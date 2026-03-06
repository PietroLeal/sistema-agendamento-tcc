import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaDisponibilidadePage } from './consulta-disponibilidade.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaDisponibilidadePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaDisponibilidadePageRoutingModule {}
