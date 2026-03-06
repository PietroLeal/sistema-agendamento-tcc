import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { GestaoProfPage } from './gestao-prof.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    GestaoProfPage, 
    RouterModule.forChild([
      {
        path: '',
        component: GestaoProfPage
      }
    ])
  ]
})
export class GestaoProfPageModule {}
