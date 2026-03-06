import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroDisponibilidadePageRoutingModule } from './cadastro-disponibilidade-routing.module';

import { CadastroDisponibilidadePage } from './cadastro-disponibilidade.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroDisponibilidadePageRoutingModule
  ],
  declarations: [CadastroDisponibilidadePage]
})
export class CadastroDisponibilidadePageModule {}
