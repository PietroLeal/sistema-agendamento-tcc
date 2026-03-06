import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NotificacoesPage } from '../notificacoes/notificacoes.page';

interface Reserva {
  id: number;
  title: string;
  date: string;
  time: string;
  room: string;
  status: string;
  statusColor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class DashboardPage implements OnInit {
  tipoUsuario: string = '';
  recentBookings: Reserva[] = [];

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // 🔹 Tenta obter o tipo da rota ou do usuário logado
    const routeTipo = this.route.snapshot.data['tipo'];
    const userData = localStorage.getItem('usuarioLogado');
    const user = userData ? JSON.parse(userData) : null;

    this.tipoUsuario = routeTipo || user?.nivel || 'Professor';

    // 🔹 Carrega reservas salvas
    const reservasSalvas = localStorage.getItem('reservas');
    if (reservasSalvas) {
      try {
        const reservas = JSON.parse(reservasSalvas);
        this.recentBookings = reservas.map((r: any, index: number) => ({
          id: index,
          title: `Reserva: ${r.ambiente || 'Ambiente'}`,
          date: r.data,
          time: `${r.horaInicio} - ${r.horaFim}`,
          room: r.ambiente,
          status: r.status,
          statusColor:
            r.status === 'Ativo'
              ? 'success'
              : r.status === 'Cancelado'
              ? 'danger'
              : 'warning',
        }));
      } catch (e) {
        console.error('Erro ao carregar reservas:', e);
        this.recentBookings = [];
      }
    }
  }

  // 🗑️ Remove reserva e atualiza disponibilidade
  removerReserva(index: number) {
    if (index > -1) {
      const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
      const reservaRemovida = reservas[index];

      // Atualiza localStorage
      reservas.splice(index, 1);
      localStorage.setItem('reservas', JSON.stringify(reservas));

      // Atualiza lista local
      this.recentBookings.splice(index, 1);

      // Libera disponibilidade, se existir
      const disponibilidades =
        JSON.parse(localStorage.getItem('disponibilidades') || '[]');
      const disponibilidade = disponibilidades.find(
        (d: any) =>
          d.data === reservaRemovida.data &&
          d.horaInicio === reservaRemovida.horaInicio &&
          d.horaFim === reservaRemovida.horaFim
      );

      if (disponibilidade) {
        disponibilidade.status = 'Livre';
        localStorage.setItem(
          'disponibilidades',
          JSON.stringify(disponibilidades)
        );
      }
    }
  }

  // 🧭 Navegações principais
  openScheduling() {
    this.navCtrl.navigateForward('/cadastro-reserva');
  }

  openGerenciarDisponibilidade() {
    this.navCtrl.navigateForward('/gerenciar-disponibilidade');
  }

  viewAvailability() {
    this.navCtrl.navigateForward('/cadastro-disponibilidade');
  }

  cancelBooking() {
    this.navCtrl.navigateForward('/cancelar-agendamento');
  }

  viewReports() {
    this.navCtrl.navigateForward('/relatorios');
  }

  manageUsers() {
    this.navCtrl.navigateForward('/usuarios');
  }

  openConsultaGeral() {
    this.navCtrl.navigateForward('/consulta-agendamentos');
  }

  openGestaoProfessores() {
    this.navCtrl.navigateForward('/gestao-prof');
  }

  openDetalhesAgendamentos() {
    this.navCtrl.navigateForward('/visualizacao-detalhada');
  }

  openGerenciarSalas() {
    this.navCtrl.navigateForward('/consulta-salas');
  }

  viewLogs() {
    this.navCtrl.navigateForward('/ver-logs');
  }

  generateReports() {
    this.navCtrl.navigateForward('/relatorios-tecnicos');
  }

  openAprovarAgendamentos() {
    this.navCtrl.navigateForward('/aprovar-agendamentos');
  }

  // ⚙️ Novas rotas adicionais
  openPerfis() {
    this.navCtrl.navigateForward('/perfis');
  }

  openPermissoes() {
    this.navCtrl.navigateForward('/permissoes');
  }

  openRecursos() {
    this.navCtrl.navigateForward('/recursos');
  }

  // 👤 Abrir perfil do usuário
  openUserProfile() {
    this.navCtrl.navigateForward('/user-profile');
  }

  // 🔔 Abrir modal de notificações
  async checkNotifications() {
    const modal = await this.modalCtrl.create({
      component: NotificacoesPage,
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75,
    });
    await modal.present();
  }
}
