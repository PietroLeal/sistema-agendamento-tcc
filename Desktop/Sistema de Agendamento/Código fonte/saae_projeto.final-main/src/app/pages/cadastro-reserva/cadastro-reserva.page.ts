import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Ambiente {
  id: number;
  nome: string;
  icone?: string;
  descricao?: string;
  numero?: number;
  capacidade?: number;
  tipoAmbiente?: string;
}

@Component({
  selector: 'app-cadastro-reserva',
  templateUrl: './cadastro-reserva.page.html',
  styleUrls: ['./cadastro-reserva.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CadastroReservaPage {
  ambientes: Ambiente[] = [];

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.carregarAmbientes();
  }

  carregarAmbientes() {
    const salvas = localStorage.getItem('ambientes');
    if (salvas) {
      this.ambientes = JSON.parse(salvas);
    } else {
      this.ambientes = [
        { id: 1, nome: 'Auditório', icone: 'business-outline' },
        { id: 2, nome: 'Laboratório 1', icone: 'laptop-outline' },
        { id: 3, nome: 'Laboratório 2', icone: 'laptop-outline' },
        { id: 4, nome: 'Laboratório 3', icone: 'laptop-outline' },
        { id: 5, nome: 'Sala de Vídeo 1', icone: 'videocam-outline' },
        { id: 6, nome: 'Sala de Vídeo 2', icone: 'videocam-outline' },
        { id: 7, nome: 'Sala de Vídeo 3', icone: 'videocam-outline' },
        { id: 8, nome: 'Laboratório de Ciências', icone: 'flask-outline' }
      ];
      localStorage.setItem('ambientes', JSON.stringify(this.ambientes));
    }
  }

  async criarAmbiente() {
    const alert = await this.alertCtrl.create({
      header: 'Criar Novo Ambiente',
      inputs: [
        { name: 'nome', type: 'text', placeholder: 'Nome do ambiente' },
        { name: 'descricao', type: 'text', placeholder: 'Descrição' },
        { name: 'numero', type: 'number', placeholder: 'Número da sala' },
        { name: 'capacidade', type: 'number', placeholder: 'Capacidade' },
        { name: 'tipoAmbiente', type: 'text', placeholder: 'Tipo de Ambiente' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Criar',
          handler: async (data) => {
            if (!data.nome || !data.numero) {
              const toast = await this.toastCtrl.create({
                message: 'Nome e número são obrigatórios!',
                duration: 2000,
                color: 'warning'
              });
              toast.present();
              return false;
            }

            const novoId = this.ambientes.length > 0 ? Math.max(...this.ambientes.map(a => a.id)) + 1 : 1;
            this.ambientes.push({ id: novoId, icone: undefined, ...data });

            localStorage.setItem('ambientes', JSON.stringify(this.ambientes));

            const toast = await this.toastCtrl.create({
              message: 'Ambiente criado com sucesso!',
              duration: 2000,
              color: 'success'
            });
            toast.present();
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  selecionarAmbiente(ambiente: Ambiente) {
    this.router.navigateByUrl('/cadastro-reserva-data', { state: { ambienteSelecionado: ambiente } });
  }

  checkNotifications() {
    console.log('Notificações futuras');
  }
}
