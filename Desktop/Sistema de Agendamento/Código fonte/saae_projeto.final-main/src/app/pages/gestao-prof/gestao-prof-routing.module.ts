import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestaoProfPage } from './gestao-prof.page';

const routes: Routes = [
  {
    path: '',
    component: GestaoProfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestaoProfPageRoutingModule {}
