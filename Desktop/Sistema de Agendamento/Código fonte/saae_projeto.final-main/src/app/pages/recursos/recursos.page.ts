import { Component } from '@angular/core';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.page.html',
  styleUrls: ['./recursos.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RecursosPage {
  recursos: any[] = [];

  modalAberto = false;
  recursoEditando: any = null;
  novoRecurso = { nome: '', tipo: '' };

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.carregarRecursos(); // carrega do "banco"
  }

  // -------------------------------
  // LOCAL STORAGE (simula banco real)
  // -------------------------------
  private salvarRecursos() {
    localStorage.setItem('recursos', JSON.stringify(this.recursos));
  }

  private carregarRecursos() {
    const dados = localStorage.getItem('recursos');
    if (dados) {
      this.recursos = JSON.parse(dados);
    } else {
      this.recursos = []; // inicialmente vazio
      this.salvarRecursos();
    }
  }

  // -------------------------------
  // MODAL
  // -------------------------------
  abrirModal(recurso: any = null) {
    if (recurso) {
      this.recursoEditando = recurso;
      this.novoRecurso = { ...recurso };
    } else {
      this.recursoEditando = null;
      this.novoRecurso = { nome: '', tipo: '' };
    }
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  // -------------------------------
  // SALVAR RECURSO
  // -------------------------------
  async salvarRecurso() {
    if (!this.novoRecurso.nome || !this.novoRecurso.tipo) {
      const toast = await this.toastController.create({
        message: 'Preencha todos os campos!',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    if (this.recursoEditando) {
      Object.assign(this.recursoEditando, this.novoRecurso);
      this.recursoEditando = null;
      this.modalAberto = false;
      this.salvarRecursos();

      const toast = await this.toastController.create({
        message: 'Recurso atualizado com sucesso!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } else {
      const novoId = this.recursos.length > 0
        ? Math.max(...this.recursos.map(r => r.id)) + 1
        : 1;

      this.recursos.push({ id: novoId, ...this.novoRecurso });
      this.modalAberto = false;
      this.salvarRecursos();

      const toast = await this.toastController.create({
        message: 'Recurso criado com sucesso!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    }
  }

  // -------------------------------
  // EXCLUIR RECURSO
  // -------------------------------
  async excluirRecurso(recurso: any) {
    const alert = await this.alertController.create({
      header: 'Excluir Recurso',
      message: `Deseja realmente excluir o recurso <strong>${recurso.nome}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: async () => {
            this.recursos = this.recursos.filter(r => r.id !== recurso.id);
            this.salvarRecursos();

            const toast = await this.toastController.create({
              message: 'Recurso excluído com sucesso!',
              duration: 2000,
              color: 'danger'
            });
            await toast.present();
          }
        }
      ]
    });
    await alert.present();
  }
}
