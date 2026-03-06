import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GerenciarDisponibilidadePageRoutingModule } from './gerenciar-disponibilidade-routing.module';
import { GerenciarDisponibilidadePage } from './gerenciar-disponibilidade.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GerenciarDisponibilidadePageRoutingModule,
    GerenciarDisponibilidadePage // ✅ importa a página standalone
  ]
})
export class GerenciarDisponibilidadePageModule {}
