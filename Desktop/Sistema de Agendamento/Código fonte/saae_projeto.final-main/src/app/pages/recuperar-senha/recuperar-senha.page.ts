import { Component } from '@angular/core';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.page.html',
  styleUrls: ['./recuperar-senha.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecuperarSenhaPage {
  email: string = '';

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  async enviarEmail() {
    if (!this.email || !this.email.includes('@')) {
      const toast = await this.toastController.create({
        message: 'Por favor, insira um e-mail válido.',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'E-mail enviado',
      message: `Enviamos um link de redefinição de senha para <strong>${this.email}</strong>.`,
      buttons: ['OK']
    });

    await alert.present();
    this.email = '';
  }
}
