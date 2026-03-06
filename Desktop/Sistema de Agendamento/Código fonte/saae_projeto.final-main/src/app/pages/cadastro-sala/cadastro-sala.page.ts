import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-sala',
  templateUrl: './cadastro-sala.page.html',
  styleUrls: ['./cadastro-sala.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class CadastroSalaPage {

  sala = {
    nome: '',
    descricao: '',
    numero: null,
    capacidade: null,
    tipo: ''
  };

  tiposSala = [
    { id: 1, descricao: 'Sala De Vídeo' },
    { id: 2, descricao: 'Laboratório de Informática' },
    { id: 3, descricao: 'Auditório' },
    { id: 4, descricao: 'Laboratório de Química' },
    { id: 5, descricao: 'Biblioteca' }
  ];

  loading = false;

  constructor(
    private toastController: ToastController,
    private router: Router
  ) {}

  async cadastrarSala() {
    if (!this.sala.nome || !this.sala.descricao || !this.sala.numero || !this.sala.capacidade || !this.sala.tipo) {
      await this.mostrarToast('Por favor, preencha todos os campos.', 'danger');
      return;
    }

    this.loading = true;

    setTimeout(async () => {
      this.loading = false;
      console.log('Sala cadastrada:', this.sala);
      await this.mostrarToast('Sala cadastrada com sucesso!', 'success');

      // Redireciona para dashboard ou lista de salas
      this.router.navigate(['/dashboard']);
    }, 1500);
  }

  async mostrarToast(mensagem: string, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor,
      position: 'top'
    });
    await toast.present();
  }
}
