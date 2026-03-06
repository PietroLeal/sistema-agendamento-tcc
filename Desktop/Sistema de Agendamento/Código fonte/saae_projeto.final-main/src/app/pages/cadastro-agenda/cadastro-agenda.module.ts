import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroAgendaPageRoutingModule } from './cadastro-agenda-routing.module';

import { CadastroAgendaPage } from './cadastro-agenda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroAgendaPageRoutingModule
  ],
  declarations: [CadastroAgendaPage]
})
export class CadastroAgendaPageModule {}
