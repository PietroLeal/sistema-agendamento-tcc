import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CancelarAgendamentoPageRoutingModule } from './cancelar-agendamento-sala-routing.module';
import { CancelarAgendamentoPage } from './cancelar-agendamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelarAgendamentoPageRoutingModule
  ],
  declarations: [CancelarAgendamentoPage]
})
export class CancelarAgendamentoPageModule {}
