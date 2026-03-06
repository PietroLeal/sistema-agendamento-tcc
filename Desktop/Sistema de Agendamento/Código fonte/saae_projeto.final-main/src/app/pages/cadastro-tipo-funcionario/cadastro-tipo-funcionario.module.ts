import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroTipoFuncionarioPageRoutingModule } from './cadastro-tipo-funcionario-routing.module';

import { CadastroTipoFuncionarioPage } from './cadastro-tipo-funcionario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroTipoFuncionarioPageRoutingModule
  ],
  declarations: [CadastroTipoFuncionarioPage]
})
export class CadastroTipoFuncionarioPageModule {}
