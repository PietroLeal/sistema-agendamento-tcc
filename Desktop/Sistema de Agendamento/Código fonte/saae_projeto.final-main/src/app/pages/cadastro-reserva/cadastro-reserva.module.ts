import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CadastroReservaPageRoutingModule } from './cadastro-reserva-routing.module';

import { CadastroReservaPage } from './cadastro-reserva.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroReservaPageRoutingModule
  ],
  declarations: [CadastroReservaPage]
})
export class CadastroReservaPageModule {}
