import { Component } from '@angular/core';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

interface Usuario {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  tipo: 'Professor' | 'Coordenador' | 'Diretor' | 'Chefe de TI' | 'Funcionário Administrativo';
  rota: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class LoginPage {
  email: string = '';
  senha: string = '';
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(private navCtrl: NavController, private toastCtrl: ToastController) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!this.email || !this.senha) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, preencha todos os campos.',
        duration: 2000,
        color: 'danger',
        position: 'top',
      });
      await toast.present();
      return;
    }

    this.loading = true;

    setTimeout(async () => {
      this.loading = false;

      // Usuários predefinidos com todas as informações para perfil
      const usuarios: Usuario[] = [
        { nome: 'João da Silva', email: 'professor@teste.com', telefone: '(22) 99999-1111', senha: '123456', tipo: 'Professor', rota: '/dashboard-professor' },
        { nome: 'Maria Oliveira', email: 'coordenador@teste.com', telefone: '(22) 99999-2222', senha: '123456', tipo: 'Coordenador', rota: '/dashboard-coordenador' },
        { nome: 'Carlos Souza', email: 'diretor@teste.com', telefone: '(22) 99999-3333', senha: '123456', tipo: 'Diretor', rota: '/dashboard-diretor' },
        { nome: 'Ana Pereira', email: 'chefe.ti@teste.com', telefone: '(22) 99999-4444', senha: '123456', tipo: 'Chefe de TI', rota: '/dashboard-chefe-ti' },
        { nome: 'Paulo Lima', email: 'administrativo@teste.com', telefone: '(22) 99999-5555', senha: '123456', tipo: 'Funcionário Administrativo', rota: '/dashboard-admin' }
      ];

      const usuario = usuarios.find(
        u => u.email.toLowerCase() === this.email.toLowerCase() && u.senha === this.senha
      );

      if (usuario) {
        // Salva usuário completo no localStorage para usar no perfil
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

        // Redireciona para o dashboard correto
        this.navCtrl.navigateRoot(usuario.rota);
      } else {
        const toast = await this.toastCtrl.create({
          message: 'Email ou senha incorretos.',
          duration: 2000,
          color: 'danger',
          position: 'top',
        });
        await toast.present();
      }
    }, 1000);
  }

  goToRecuperarSenha() {
    this.navCtrl.navigateForward('/recuperar-senha');
  }

  goToCadastro() {
    this.navCtrl.navigateForward('/cadastro-funcionario');
  }
}
