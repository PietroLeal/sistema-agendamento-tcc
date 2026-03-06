import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  nivel: 'Professor' | 'Diretor' | 'Coordenador' | 'Chefe de TI' | 'Funcionário Administrativo';
  ativo: boolean;
}


@Component({
  selector: 'app-cadastro-funcionario',
  templateUrl: './cadastro-funcionario.page.html',
  styleUrls: ['./cadastro-funcionario.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class CadastroFuncionarioPage {
  funcionario = {
    nome: '',
    email: '',
    telefone: '',
    tipo: '' as 'Professor' | 'Diretor' | 'Coordenador' | 'Chefe de TI' | 'Funcionário Administrativo' | '',
    senha: '',
    confirmarSenha: ''
  };


  showPassword = false;
  loading = false;


  constructor(
    private toastController: ToastController,
    private router: Router
  ) {}


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  onSenhaInput() {
    this.funcionario.confirmarSenha = '';
  }


  isSenhaValida(): boolean {
    return this.funcionario.senha === this.funcionario.confirmarSenha;
  }


  emailValido(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }


  telefoneValido(telefone: string): boolean {
    const apenasNumeros = telefone.replace(/\D/g, '');
    return apenasNumeros.length >= 10;
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


  async cadastrarFuncionario() {
    if (
      !this.funcionario.nome ||
      !this.funcionario.email ||
      !this.funcionario.telefone ||
      !this.funcionario.tipo ||
      !this.funcionario.senha ||
      !this.funcionario.confirmarSenha
    ) {
      await this.mostrarToast('Preencha todos os campos obrigatórios', 'warning');
      return;
    }


    if (!this.emailValido(this.funcionario.email)) {
      await this.mostrarToast('E-mail inválido', 'danger');
      return;
    }


    if (!this.telefoneValido(this.funcionario.telefone)) {
      await this.mostrarToast('Telefone inválido', 'danger');
      return;
    }


    if (!this.isSenhaValida()) {
      await this.mostrarToast('As senhas não coincidem', 'danger');
      return;
    }


    this.loading = true;


    setTimeout(async () => {
      this.loading = false;


      const usuariosSalvos: Usuario[] = JSON.parse(localStorage.getItem('usuarios') || '[]');


      const novoUsuario: Usuario = {
        id: usuariosSalvos.length ? Math.max(...usuariosSalvos.map(u => u.id)) + 1 : 1,
        nome: this.funcionario.nome,
        email: this.funcionario.email,
        telefone: this.funcionario.telefone,
        senha: this.funcionario.senha,
        nivel: this.funcionario.tipo as 'Professor' | 'Diretor' | 'Coordenador' | 'Chefe de TI' | 'Funcionário Administrativo',
        ativo: true
      };


      usuariosSalvos.push(novoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuariosSalvos));


      // Salva o usuário logado
      localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));


      await this.mostrarToast('Cadastro realizado com sucesso!', 'success');


      // Redireciona para o dashboard correto de acordo com o tipo
      const rotaDashboard = (() => {
        switch (novoUsuario.nivel) {
          case 'Professor': return '/dashboard-professor';
          case 'Coordenador': return '/dashboard-coordenador';
          case 'Diretor': return '/dashboard-diretor';
          case 'Chefe de TI': return '/dashboard-chefe-ti';
          case 'Funcionário Administrativo': return '/dashboard-admin';
          default: return '/login';
        }
      })();


      this.router.navigate([rotaDashboard]);


      // Limpa o formulário
      this.funcionario = { nome: '', email: '', telefone: '', tipo: '', senha: '', confirmarSenha: '' };
    }, 1000);
  }
}
