import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelatoriosTecnicosPage } from './relatorios-tecnicos.page';

const routes: Routes = [
  {
    path: '',
    component: RelatoriosTecnicosPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatoriosTecnicosRoutingModule {}
