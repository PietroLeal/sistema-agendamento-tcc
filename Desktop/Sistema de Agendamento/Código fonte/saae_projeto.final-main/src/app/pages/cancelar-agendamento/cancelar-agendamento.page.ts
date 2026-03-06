import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

interface Reserva {
  id: number;
  ambiente: string;
  sala: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  evento: string;
  segmento: string;
  qtdPessoas: number | null;
  funcionario: string;
  status: string;
}

@Component({
  selector: 'app-cancelar-agendamento',
  templateUrl: './cancelar-agendamento.page.html',
  styleUrls: ['./cancelar-agendamento.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class CancelarAgendamentoPage implements OnInit {
  agendamentos: Reserva[] = [];
  ultimoCancelado: Reserva | null = null;

  constructor(private navCtrl: NavController, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.carregarAgendamentos();
  }

  // 🔹 Carrega as reservas salvas no localStorage
  carregarAgendamentos() {
    this.agendamentos = JSON.parse(localStorage.getItem('reservas') || '[]');
  }

  // 🔹 Cancela um agendamento e atualiza o localStorage
  async cancelarAgendamento(id: number) {
    const index = this.agendamentos.findIndex(a => a.id === id);

    if (index >= 0) {
      this.ultimoCancelado = { ...this.agendamentos[index] };
      this.agendamentos[index].status = 'CANCELADO';

      // Atualiza o localStorage
      localStorage.setItem('reservas', JSON.stringify(this.agendamentos));

      // Remove também da disponibilidade
      let disponibilidade = JSON.parse(localStorage.getItem('itensDisponibilidade') || '[]');
      disponibilidade = disponibilidade.filter(
        (d: any) =>
          !(
            d.data === this.ultimoCancelado?.data &&
            d.horaInicio === this.ultimoCancelado?.horaInicio &&
            d.ambiente === this.ultimoCancelado?.sala
          )
      );
      localStorage.setItem('itensDisponibilidade', JSON.stringify(disponibilidade));

      // Mostra confirmação
      const toast = await this.toastCtrl.create({
        message: `Agendamento "${this.ultimoCancelado.evento}" cancelado.`,
        duration: 3000,
        color: 'danger',
      });
      toast.present();
    }
  }

  voltarDashboard() {
    this.navCtrl.navigateBack('/dashboard');
  }
}
