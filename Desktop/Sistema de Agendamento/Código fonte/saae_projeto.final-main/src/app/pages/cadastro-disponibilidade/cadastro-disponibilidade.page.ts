import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Horario {
  inicio: string;
  fim: string;
}

@Component({
  selector: 'app-cadastro-disponibilidade',
  templateUrl: './cadastro-disponibilidade.page.html',
  styleUrls: ['./cadastro-disponibilidade.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class CadastroDisponibilidadePage {
  dataSelecionada: string = '';
  horarios: Horario[] = [];
  horarioSelecionado: Horario | null = null;
  modalAberto = false;

  // Injetei ToastController aqui
  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  abrirHorarios() {
    this.gerarHorarios();
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.horarioSelecionado = null;
  }

  gerarHorarios() {
    const blocos: Horario[] = [];
    const bloqueios = [
      { inicio: '08:40', fim: '08:50' },
      { inicio: '12:10', fim: '12:30' },
      { inicio: '15:00', fim: '15:10' }
    ];

    let hora = 7;
    let minuto = 0;

    while (hora < 18) {
      let inicio = this.formatarHora(hora, minuto);
      let fimHora = hora;
      let fimMinuto = minuto + 50;
      if (fimMinuto >= 60) {
        fimHora += Math.floor(fimMinuto / 60);
        fimMinuto = fimMinuto % 60;
      }
      let fim = this.formatarHora(fimHora, fimMinuto);

      const sobreposto = bloqueios.some(b => this.sobrepoe(inicio, fim, b.inicio, b.fim));
      if (!sobreposto) {
        blocos.push({ inicio, fim });
      }

      hora = fimHora;
      minuto = fimMinuto;
    }

    this.horarios = blocos;
  }

  formatarHora(hora: number, minuto: number): string {
    return `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
  }

  sobrepoe(inicioA: string, fimA: string, inicioB: string, fimB: string): boolean {
    return !(fimA <= inicioB || inicioA >= fimB);
  }

  selecionarHorario(h: Horario) {
    this.horarioSelecionado = h;
  }

  async salvarDisponibilidade() {
    if (this.horarioSelecionado && this.dataSelecionada) {
      console.log('Disponibilidade salva:', {
        data: this.dataSelecionada,
        ...this.horarioSelecionado
      });
      this.modalAberto = false;

      // Exibe toast de sucesso
      await this.mostrarToastSucesso('Agenda cadastrada com sucesso!');

      this.router.navigate(['/cadastro-agenda']);
    }
  }

  async mostrarToastSucesso(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2500,
      color: 'success',
      position: 'top',
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
  }

  checkNotifications() {
    console.log('Verificando notificações...');
  }
}
