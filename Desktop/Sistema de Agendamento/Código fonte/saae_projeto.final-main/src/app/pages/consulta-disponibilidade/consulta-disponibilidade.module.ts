import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultaDisponibilidadePageRoutingModule } from './consulta-disponibilidade-routing.module';

import { ConsultaDisponibilidadePage } from './consulta-disponibilidade.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaDisponibilidadePageRoutingModule
  ],
  declarations: [ConsultaDisponibilidadePage]
})
export class ConsultaDisponibilidadePageModule {}
