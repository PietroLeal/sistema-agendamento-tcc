import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultaSalasPageRoutingModule } from './consulta-salas-routing.module';

import { ConsultaSalasPage } from './consulta-salas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaSalasPageRoutingModule
  ],
  declarations: [ConsultaSalasPage]
})
export class ConsultaSalasPageModule {}
