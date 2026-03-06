import { Component } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.page.html',
  styleUrls: ['./notificacoes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NotificacoesPage {
  notificacoes = [
    {
      titulo: 'Reserva Aprovada',
      mensagem: 'Sua reserva para o Auditório foi aprovada.',
      data: '2025-05-22',
      tipo: 'Agendamento'
    },
    {
      titulo: 'Reserva Cancelada',
      mensagem: 'A reserva do Lab. Informática foi cancelada.',
      data: '2025-05-21',
      tipo: 'Cancelamento'
    },
    {
      titulo: 'Lembrete',
      mensagem: 'Sua atividade no Lab. Química começa em 30 minutos.',
      data: '2025-05-20',
      tipo: 'Lembrete'
    }
  ];

  notificacoesFiltradas = [...this.notificacoes];
}
