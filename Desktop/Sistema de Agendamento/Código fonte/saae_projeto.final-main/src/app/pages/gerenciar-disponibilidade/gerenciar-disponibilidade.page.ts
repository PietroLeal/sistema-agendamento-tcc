import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

export interface Horario {
  horaInicio: string;
  horaFim: string;
  status: 'Livre' | 'Bloqueada';
  ambiente: string;
  data: string;
}

export interface Reserva {
  id: number;
  sala: string;
  ambiente: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  status: 'APROVADO' | 'PENDENTE' | 'CANCELADO';
  [key: string]: any;
}

@Component({
  selector: 'app-gerenciar-disponibilidade',
  templateUrl: './gerenciar-disponibilidade.page.html',
  styleUrls: ['./gerenciar-disponibilidade.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class GerenciarDisponibilidadePage {
  dataISO = new Date().toISOString().slice(0, 10);
  ambientes: string[] = [];
  filtroAmbiente: string = '';
  filtroData: string = '';
  novoAmbiente: string = '';
  horarioSelecionado: string = '';
  itens: Horario[] = [];

  // ⏰ Horários pré-definidos disponíveis para seleção
  horarios: { inicio: string; fim: string }[] = [
    { inicio: '07:00', fim: '08:40' },
    { inicio: '08:50', fim: '10:30' },
    { inicio: '10:30', fim: '12:10' },
    { inicio: '12:30', fim: '14:10' },
    { inicio: '14:20', fim: '16:00' },
    { inicio: '16:10', fim: '17:40' },
  ];

  constructor(private alert: AlertController, private toast: ToastController) {
    this.carregarAmbientes();
    this.carregarItens();
  }

  private carregarAmbientes() {
    const ambientesSalvos = localStorage.getItem('ambientes');
    if (ambientesSalvos) {
      this.ambientes = JSON.parse(ambientesSalvos).map((a: any) => a.nome);
    } else {
      this.ambientes = [
        'Sala de Vídeo 1', 'Sala de Vídeo 2', 'Sala de Vídeo 3',
        'Lab. de Informática 1', 'Lab. de Informática 2', 'Lab. de Informática 3',
        'Lab. de Ciências', 'Auditório'
      ];
    }
  }

  private salvarItens() {
    localStorage.setItem('itensDisponibilidade', JSON.stringify(this.itens));
  }

  private carregarItens() {
    const dados = localStorage.getItem('itensDisponibilidade');
    if (dados) {
      this.itens = JSON.parse(dados).map((h: any) => ({
        horaInicio: h.horaInicio || h.horainicio,
        horaFim: h.horaFim || h.horafim,
        status: h.status,
        ambiente: h.ambiente,
        data: h.data,
      }));
    } else {
      this.itens = [];
      this.salvarItens();
    }
  }

  filtrarItens(): Horario[] {
    return this.itens.filter((h) => {
      const ambienteOK = !this.filtroAmbiente || h.ambiente === this.filtroAmbiente;
      const dataOK = !this.filtroData || h.data === this.filtroData.slice(0, 10);
      return ambienteOK && dataOK;
    });
  }

  async cadastrar() {
    if (!this.novoAmbiente) return this.mostrarToast('Selecione um ambiente.');
    if (!this.horarioSelecionado) return this.mostrarToast('Selecione um horário.');

    const horarioEscolhido = this.horarios.find(
      (h) => `${h.inicio}-${h.fim}` === this.horarioSelecionado
    );
    if (!horarioEscolhido) return;

    const { inicio, fim } = horarioEscolhido;

    const conflito = this.itens.find(
      (h) =>
        h.ambiente === this.novoAmbiente &&
        h.data === this.dataISO &&
        !(fim <= h.horaInicio || inicio >= h.horaFim)
    );
    if (conflito)
      return this.mostrarToast(
        `Conflito com ${conflito.ambiente}: ${conflito.horaInicio} — ${conflito.horaFim}`
      );

    this.itens.push({
      horaInicio: inicio,
      horaFim: fim,
      status: 'Livre',
      ambiente: this.novoAmbiente,
      data: this.dataISO,
    });

    this.salvarItens();
    this.horarioSelecionado = '';
    this.novoAmbiente = '';
    this.mostrarToast('Horário cadastrado com sucesso.');
  }

  alterarStatus(i: number, status: 'Livre' | 'Bloqueada') {
    const horario = this.itens[i];
    this.itens[i].status = status;
    this.salvarItens();

    if (status === 'Livre') {
      this.liberarReserva(horario, false);
      this.mostrarToast(`Status alterado para ${status} e reservas liberadas.`);
    } else {
      this.mostrarToast(`Status alterado para ${status}`);
    }
  }

  async excluir(i: number) {
    const horario = this.itens[i];
    const alert = await this.alert.create({
      header: 'Excluir',
      message: `Remover horário ${horario.horaInicio} — ${horario.horaFim} (${horario.ambiente}, ${horario.data})?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.itens.splice(i, 1);
            this.salvarItens();
            this.liberarReserva(horario);
            this.mostrarToast('Horário excluído e reservas liberadas.');
          },
        },
      ],
    });
    await alert.present();
  }

  private liberarReserva(horario: Horario, mostrarMensagem: boolean = true) {
    const reservas: Reserva[] = JSON.parse(localStorage.getItem('reservas') || '[]');
    let algumaAlterada = false;

    const atualizadas = reservas.map((r) => {
      if (
        r.sala === horario.ambiente &&
        r.data === horario.data &&
        r.horaInicio === horario.horaInicio &&
        r.horaFim === horario.horaFim &&
        r.status !== 'CANCELADO'
      ) {
        algumaAlterada = true;
        return { ...r, status: 'CANCELADO' };
      }
      return r;
    });

    localStorage.setItem('reservas', JSON.stringify(atualizadas));

    if (algumaAlterada) {
      const index = this.itens.findIndex(
        (h) =>
          h.ambiente === horario.ambiente &&
          h.data === horario.data &&
          h.horaInicio === horario.horaInicio &&
          h.horaFim === horario.horaFim
      );
      if (index > -1) {
        this.itens[index].status = 'Livre';
        this.salvarItens();
      }
    }

    if (mostrarMensagem && algumaAlterada) {
      this.mostrarToast('Reserva associada liberada e horário atualizado para Livre.');
    }
  }

  private mostrarToast(msg: string) {
    this.toast.create({ message: msg, duration: 1500 }).then((t) => t.present());
  }
}
