import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-tipo-funcionario',
  templateUrl: './cadastro-tipo-funcionario.page.html',
  styleUrls: ['./cadastro-tipo-funcionario.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class CadastroTipoFuncionarioPage {

  tipoFuncionario = {
    cargo: ''
  };

  loading = false;

  constructor(
    private toastController: ToastController,
    private router: Router
  ) {}

  async cadastrarTipoFuncionario() {
    if (!this.tipoFuncionario.cargo) {
      await this.mostrarToast('Por favor, informe o nome do cargo.', 'danger');
      return;
    }

    this.loading = true;

    setTimeout(async () => {
      this.loading = false;
      console.log('Tipo de Funcionário cadastrado:', this.tipoFuncionario);
      await this.mostrarToast('Tipo cadastrado com sucesso!', 'success');

      // Redireciona, por exemplo, para dashboard
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
