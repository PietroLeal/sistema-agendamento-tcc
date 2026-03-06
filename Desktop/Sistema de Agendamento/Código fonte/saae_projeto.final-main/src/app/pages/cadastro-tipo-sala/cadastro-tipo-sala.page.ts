import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-tipo-sala',
  templateUrl: './cadastro-tipo-sala.page.html',
  styleUrls: ['./cadastro-tipo-sala.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class CadastroTipoSalaPage {

  tipoSala = {
    descricao: ''
  };

  loading = false;

  constructor(
    private toastController: ToastController,
    private router: Router
  ) {}

  async cadastrarTipoSala() {
    if (!this.tipoSala.descricao) {
      await this.mostrarToast('Por favor, informe a descrição.', 'danger');
      return;
    }

    this.loading = true;

    setTimeout(async () => {
      this.loading = false;
      console.log('Tipo de Sala cadastrado:', this.tipoSala);
      await this.mostrarToast('Tipo de sala cadastrado com sucesso!', 'success');

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
