import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualizacaoDetalhadaPage } from './visualizacao-detalhada.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizacaoDetalhadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizacaoDetalhadaPageRoutingModule {}
