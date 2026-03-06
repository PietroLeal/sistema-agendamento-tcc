import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControleAcessoPageRoutingModule } from './controle-acesso-routing.module';

import { ControleAcessoPage } from './controle-acesso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControleAcessoPageRoutingModule
  ],
  declarations: [ControleAcessoPage]
})
export class ControleAcessoPageModule {}
