import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroTipoSalaPageRoutingModule } from './cadastro-tipo-sala-routing.module';

import { CadastroTipoSalaPage } from './cadastro-tipo-sala.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroTipoSalaPageRoutingModule
  ],
  declarations: [CadastroTipoSalaPage]
})
export class CadastroTipoSalaPageModule {}
