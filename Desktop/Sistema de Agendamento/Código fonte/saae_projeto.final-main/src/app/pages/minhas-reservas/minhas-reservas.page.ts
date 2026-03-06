import { Component, OnInit } from '@angular/core';
import { 
  CommonModule, 
  DatePipe 
} from '@angular/common';
import { 
  IonicModule, 
  AlertController, 
  ToastController,
  ModalController
} from '@ionic/angular';
import { 
  FormsModule, 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup,
  Validators 
} from '@angular/forms';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

interface Reserva {
  id: number;
  sala: string;
  data: string;
  horario: string;
  status: 'Confirmada' | 'Cancelada';
}

@Component({
  standalone: true,
  selector: 'app-minhas-reservas',
  templateUrl: './minhas-reservas.page.html',
  styleUrls: ['./minhas-reservas.page.scss'],
  imports: [
    CommonModule, 
    IonicModule, 
    FormsModule, 
    ReactiveFormsModule,
    DatePipe
  ],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.3s ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class MinhasReservasPage implements OnInit {
  reservas: Reserva[] = [];
  filteredReservas: Reserva[] = [];
  reservaEditando: Reserva | null = null;
  filter: 'all' | 'confirmed' | 'cancelled' = 'all';
  notificationsCount = 2;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    this.form = this.fb.group({
      sala: ['', [Validators.required, Validators.minLength(3)]],
      data: ['', Validators.required],
      horario: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2} - \d{2}:\d{2}$/)]]
    });
  }

  ngOnInit() {
    this.carregarReservas();
  }

  carregarReservas() {
    // Simulação de dados - na prática viria de um serviço/API
    this.reservas = [
      { 
        id: 1, 
        sala: 'Auditório', 
        data: '2025-07-01', 
        horario: '08:00 - 10:00', 
        status: 'Confirmada' 
      },
      { 
        id: 2, 
        sala: 'Sala de Vídeo 1', 
        data: '2025-07-02', 
        horario: '10:00 - 12:00', 
        status: 'Confirmada' 
      },
      { 
        id: 3, 
        sala: 'Lab. Informática 2', 
        data: '2025-07-03', 
        horario: '14:00 - 16:00', 
        status: 'Cancelada' 
      },
      { 
        id: 4, 
        sala: 'Sala de Vídeo 3', 
        data: '2025-07-04', 
        horario: '16:00 - 18:00', 
        status: 'Confirmada' 
      }
    ];
    
    this.filtrarReservas();
  }

  getIcone(nomeSala: string): string {
    if (nomeSala.includes('Lab')) return 'laptop-outline';
    if (nomeSala.includes('Sala')) return 'tv-outline';
    if (nomeSala.includes('Auditório')) return 'business-outline';
    return 'home-outline';
  }

  filtrarReservas() {
    switch(this.filter) {
      case 'confirmed':
        this.filteredReservas = this.reservas.filter(r => r.status === 'Confirmada');
        break;
      case 'cancelled':
        this.filteredReservas = this.reservas.filter(r => r.status === 'Cancelada');
        break;
      default:
        this.filteredReservas = [...this.reservas];
    }
  }

  checkNotifications() {
    this.notificationsCount = 0;
    this.mostrarToast('Notificações marcadas como lidas');
  }

  editarReserva(reserva: Reserva) {
    this.reservaEditando = reserva;
    this.form.patchValue({
      sala: reserva.sala,
      data: reserva.data,
      horario: reserva.horario
    });
  }

  cancelarEdicao() {
    this.reservaEditando = null;
    this.form.reset();
  }

  async confirmarCancelamento(reserva: Reserva) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Cancelamento',
      message: `Tem certeza que deseja cancelar a reserva de <strong>${reserva.sala}</strong> no dia ${this.formatarData(reserva.data)}?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'alert-cancel'
        },
        {
          text: 'Sim, Cancelar',
          cssClass: 'alert-confirm',
          handler: () => this.cancelarReserva(reserva)
        }
      ]
    });

    await alert.present();
  }

  async cancelarReserva(reserva: Reserva) {
    reserva.status = 'Cancelada';
    this.filtrarReservas();
    await this.mostrarToast('Reserva cancelada com sucesso!', 'success');
  }

  async salvarAlteracao() {
    if (this.form.invalid || !this.reservaEditando) return;

    const index = this.reservas.findIndex(r => r.id === this.reservaEditando!.id);
    this.reservas[index] = { 
      ...this.reservaEditando, 
      ...this.form.value 
    };

    this.filtrarReservas();
    this.reservaEditando = null;
    this.form.reset();
    
    await this.mostrarToast('Reserva atualizada com sucesso!', 'success');
  }

  novaReserva() {
    this.router.navigate(['/cadastro-agenda']);
  }

  private formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  private async mostrarToast(mensagem: string, cor: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 2000,
      color: cor,
      position: 'top',
      cssClass: 'custom-toast'
    });
    
    await toast.present();
  }
}