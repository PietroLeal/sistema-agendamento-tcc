import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type StatusReserva = 'APROVADO' | 'PENDENTE' | 'CANCELADO';

interface Horario {
  inicio: string;
  fim: string;
}

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
  recursos: any[];
  funcionario: string;
  status: StatusReserva;
}

interface Disponibilidade {
  ambiente: string;
  horaInicio: string;
  horaFim: string;
  status: 'Livre' | 'Bloqueada';
  data: string;
}

@Component({
  selector: 'app-cadastro-reserva-data',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './cadastro-reserva-data.page.html',
  styleUrls: ['./cadastro-reserva-data.page.scss'],
})
export class CadastroReservaDataPage implements OnInit {
  ambiente: any;
  dataSelecionada: string | null = null;

  horarios: Horario[] = [
    { inicio: '07:00', fim: '08:40' },
    { inicio: '08:50', fim: '10:30' },
    { inicio: '10:30', fim: '12:10' },
    { inicio: '12:30', fim: '14:10' },
    { inicio: '14:20', fim: '16:00' },
    { inicio: '16:10', fim: '17:40' },
  ];

  horarioSelecionado: Horario | null = null;
  evento = '';
  segmento = '';
  qtdPessoas: number | null = null;
  recursosSelecionados: number[] = [];

  reservas: Reserva[] = [];
  recursos: any[] = [];
  disponibilidade: Disponibilidade[] = [];

  constructor(private router: Router, private alertCtrl: AlertController) {
    const nav = this.router.getCurrentNavigation();
    const ambienteNav = nav?.extras.state?.['ambienteSelecionado'];

    if (ambienteNav) {
      localStorage.setItem('ambienteSelecionado', JSON.stringify(ambienteNav));
      this.ambiente = ambienteNav;
    } else {
      this.ambiente = JSON.parse(localStorage.getItem('ambienteSelecionado') || '{}');
    }
  }

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    this.recursos = JSON.parse(localStorage.getItem('recursos') || '[]');
    this.disponibilidade = JSON.parse(localStorage.getItem('itensDisponibilidade') || '[]');
  }

  onDataChange() {
    this.carregarDados();
    this.horarioSelecionado = null;
  }

  isHorarioBloqueado(h: Horario): boolean {
    if (!this.dataSelecionada || !this.ambiente?.nome) return false;

    const data = this.dataSelecionada;
    const nomeAmbiente = this.ambiente.nome;

    // Verifica reservas aprovadas
    const reservado = this.reservas.some(
      r =>
        r.sala === nomeAmbiente &&
        r.data === data &&
        r.status === 'APROVADO' &&
        !(h.fim <= r.horaInicio || h.inicio >= r.horaFim)
    );

    // Verifica horários bloqueados manualmente
    const bloqueado = this.disponibilidade.some(
      d =>
        d.ambiente === nomeAmbiente &&
        d.data === data &&
        d.status === 'Bloqueada' &&
        !(h.fim <= d.horaInicio || h.inicio >= d.horaFim)
    );

    return reservado || bloqueado;
  }

  selecionarHorario(h: Horario) {
    if (this.isHorarioBloqueado(h)) return;
    this.horarioSelecionado = h;
  }

  async salvarDisponibilidade() {
    if (!this.dataSelecionada || !this.horarioSelecionado) {
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Selecione uma data e um horário antes de confirmar.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (this.isHorarioBloqueado(this.horarioSelecionado)) {
      const alert = await this.alertCtrl.create({
        header: 'Indisponível',
        message: 'Este horário já foi reservado ou bloqueado.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Cria nova reserva
    const novaReserva: Reserva = {
      id: new Date().getTime(),
      ambiente: this.ambiente?.nome || 'Ambiente',
      sala: this.ambiente?.nome || 'Sala',
      data: this.dataSelecionada,
      horaInicio: this.horarioSelecionado.inicio,
      horaFim: this.horarioSelecionado.fim,
      evento: this.evento || 'Evento não especificado',
      segmento: this.segmento || 'Não informado',
      qtdPessoas: this.qtdPessoas || 0,
      recursos: this.recursosSelecionados.map(id => this.recursos.find(r => r.id === id)),
      funcionario: 'Direção',
      status: 'APROVADO',
    };

    // Salva no localStorage
    this.reservas.push(novaReserva);
    localStorage.setItem('reservas', JSON.stringify(this.reservas));

    this.disponibilidade.push({
      ambiente: this.ambiente?.nome || 'Ambiente',
      horaInicio: this.horarioSelecionado.inicio,
      horaFim: this.horarioSelecionado.fim,
      status: 'Bloqueada',
      data: this.dataSelecionada,
    });
    localStorage.setItem('itensDisponibilidade', JSON.stringify(this.disponibilidade));

    const alert = await this.alertCtrl.create({
      header: 'Confirmado ✅',
      message: `Ambiente "${this.ambiente?.nome}" reservado para ${this.dataSelecionada} das ${this.horarioSelecionado.inicio} às ${this.horarioSelecionado.fim}.`,
      buttons: ['OK'],
    });
    await alert.present();

    // Resetar seleção para nova reserva
    this.horarioSelecionado = null;
    this.evento = '';
    this.segmento = '';
    this.qtdPessoas = null;
    this.recursosSelecionados = [];
  }
}
