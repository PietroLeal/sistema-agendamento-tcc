import { Component } from '@angular/core';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LogAcao {
  id: number;
  usuario: string;
  acao: string;
  dataHora: string;
  detalhe?: string;
}

@Component({
  selector: 'app-ver-logs',
  templateUrl: './ver-logs.page.html',
  styleUrls: ['./ver-logs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class VerLogsPage {
  filtro = '';
  logs: LogAcao[] = [
    {
      id: 1,
      usuario: 'ana.paula',
      acao: 'Login no sistema',
      dataHora: '2025-07-16 09:10:22',
      detalhe: 'IP: 192.168.0.10'
    },
    {
      id: 2,
      usuario: 'carlos.h',
      acao: 'Criou novo agendamento',
      dataHora: '2025-07-16 09:20:10',
      detalhe: 'Sala 101, 16/07/2025 14:00'
    },
    {
      id: 3,
      usuario: 'fernanda.s',
      acao: 'Editou professor',
      dataHora: '2025-07-15 15:30:45',
      detalhe: 'Alterou nome do professor para "Fernanda Souza"'
    },
  ];

  logsFiltrados: LogAcao[] = [...this.logs];

  filtrarLogs() {
    const filtroLower = this.filtro.toLowerCase();
    this.logsFiltrados = this.logs.filter(log =>
      log.usuario.toLowerCase().includes(filtroLower) ||
      log.acao.toLowerCase().includes(filtroLower)
    );
  }

  atualizarLogs(event: Event) {
    setTimeout(() => {
      (event as RefresherCustomEvent).detail.complete();
      // Aqui você pode chamar API para atualizar logs
    }, 1000);
  }
}
