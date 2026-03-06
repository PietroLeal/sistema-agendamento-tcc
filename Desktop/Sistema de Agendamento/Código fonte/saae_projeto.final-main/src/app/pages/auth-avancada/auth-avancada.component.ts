import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-avancada',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth-avancada.page.html',
  styleUrls: ['./auth-avancada.page.scss'],
})
export class AuthAvancadaPage {
  modo: 'login' | 'recuperar' | 'perguntaSecreta' = 'login';

  loginForm: FormGroup;
  recuperarForm: FormGroup;
  perguntaForm: FormGroup;

  // Simulação de banco de dados local para usuários e perguntas secretas
  usuarios = [
    { email: 'user1@email.com', senha: '123456', perguntaSecreta: 'Qual o nome da sua mãe?', respostaSecreta: 'Maria' },
    { email: 'user2@email.com', senha: 'abcdef', perguntaSecreta: 'Qual seu animal de estimação?', respostaSecreta: 'Rex' }
  ];

  usuarioEncontrado: any = null;

  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.perguntaForm = this.fb.group({
      resposta: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      this.showToast('Preencha os dados corretamente.', 'warning');
      return;
    }

    const { email, senha } = this.loginForm.value;
    const user = this.usuarios.find(u => u.email === email && u.senha === senha);

    if (user) {
      this.showToast('Login realizado com sucesso!', 'success');
      // Aqui poderia redirecionar para a página principal
    } else {
      this.showToast('E-mail ou senha incorretos.', 'danger');
    }
  }

  iniciarRecuperacao() {
    this.modo = 'recuperar';
    this.recuperarForm.reset();
    this.usuarioEncontrado = null;
  }

  async enviarEmailRecuperacao() {
    if (this.recuperarForm.invalid) {
      this.showToast('Digite um e-mail válido.', 'warning');
      return;
    }

    const email = this.recuperarForm.value.email;
    const user = this.usuarios.find(u => u.email === email);

    if (!user) {
      this.showToast('E-mail não cadastrado.', 'danger');
      return;
    }

    this.usuarioEncontrado = user;
    // Simulando envio de e-mail ou pedir pergunta secreta
    const alert = await this.alertCtrl.create({
      header: 'Recuperação de Senha',
      message: 'Escolha um método para recuperar sua senha:',
      buttons: [
        {
          text: 'E-mail',
          handler: () => this.simularEnvioEmail()
        },
        {
          text: 'Pergunta Secreta',
          handler: () => {
            this.modo = 'perguntaSecreta';
            this.perguntaForm.reset();
          }
        },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });

    await alert.present();
  }

  async simularEnvioEmail() {
    const loading = await this.loadingCtrl.create({
      message: 'Enviando e-mail...',
      duration: 2000
    });
    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();
      this.showToast('E-mail de recuperação enviado!', 'success');
      this.modo = 'login';
    }, 2000);
  }

  async verificarResposta() {
    if (this.perguntaForm.invalid) {
      this.showToast('Digite sua resposta.', 'warning');
      return;
    }

    const resposta = this.perguntaForm.value.resposta.trim().toLowerCase();
    const correta = this.usuarioEncontrado.respostaSecreta.toLowerCase();

    if (resposta === correta) {
      const alert = await this.alertCtrl.create({
        header: 'Senha Recuperada',
        message: `Sua senha é: <strong>${this.usuarioEncontrado.senha}</strong>`,
        buttons: [
          {
            text: 'Ok',
            handler: () => this.modo = 'login'
          }
        ]
      });
      await alert.present();
    } else {
      this.showToast('Resposta incorreta.', 'danger');
    }
  }

  voltarLogin() {
    this.modo = 'login';
    this.loginForm.reset();
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });
    toast.present();
  }
}
