import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  nivel: 'Professor' | 'Diretor' | 'Coordenador';
  ativo: boolean;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
})
export class UsuariosPage implements OnInit {
  usuarios: Usuario[] = [];
  filtroNome = '';
  niveis = ['Professor', 'Diretor', 'Coordenador'];

  form: FormGroup;
  modoEdicao = false;
  modalAberto = false;
  usuarioEditando: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      senha: ['', Validators.minLength(6)],
      nivel: ['Professor', Validators.required],
    });
  }

  ngOnInit() {
    const dadosSalvos = localStorage.getItem('usuarios');
    if (dadosSalvos) {
      this.usuarios = JSON.parse(dadosSalvos);
    } else {
      this.usuarios = [
        { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '11999999999', senha: '123456', nivel: 'Professor', ativo: true },
        { id: 2, nome: 'Maria Souza', email: 'maria@email.com', telefone: '11988888888', senha: '123456', nivel: 'Coordenador', ativo: true },
        { id: 3, nome: 'Carlos Pereira', email: 'carlos@email.com', telefone: '11977777777', senha: '123456', nivel: 'Diretor', ativo: true },
      ];
      this.salvarUsuarios();
    }
  }

  salvarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }

  abrirModalCriacao() {
    this.modoEdicao = false;
    this.usuarioEditando = null;
    this.form.reset({ nivel: 'Professor', senha: '' });
    this.modalAberto = true;
  }

  abrirModalEdicao(usuario: Usuario) {
    this.modoEdicao = true;
    this.usuarioEditando = usuario;
    this.form.setValue({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      senha: '', // senha não preenchida na edição
      nivel: usuario.nivel,
    });
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.usuarioEditando = null;
    this.modoEdicao = false;
    this.form.reset({ nivel: 'Professor', senha: '' });
  }

  async salvar() {
    if (this.form.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Preencha todos os campos corretamente.',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
      return;
    }

    const dados = this.form.value;

    if (this.modoEdicao && this.usuarioEditando) {
      const index = this.usuarios.findIndex(u => u.id === this.usuarioEditando!.id);
      if (index > -1) {
        const senhaFinal = dados.senha ? dados.senha : this.usuarioEditando.senha;
        this.usuarios[index] = { id: this.usuarioEditando.id, ativo: this.usuarioEditando.ativo, ...dados, senha: senhaFinal };
      }
    } else {
      const novoId = this.usuarios.length ? Math.max(...this.usuarios.map(u => u.id)) + 1 : 1;
      this.usuarios.push({ id: novoId, ativo: true, ...dados });
    }

    this.salvarUsuarios();
    this.fecharModal();
  }

  async confirmarExclusao(usuario: Usuario) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: `Deseja excluir o usuário ${usuario.nome}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Excluir', role: 'destructive', handler: () => this.excluir(usuario) },
      ],
    });
    await alert.present();
  }

  excluir(usuario: Usuario) {
    this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
    this.salvarUsuarios();
  }

  async ativarDesativar(usuario: Usuario) {
    usuario.ativo = !usuario.ativo;
    this.salvarUsuarios();

    const toast = await this.toastCtrl.create({
      message: usuario.ativo ? `${usuario.nome} foi ativado` : `${usuario.nome} foi desativado`,
      duration: 2000,
      color: usuario.ativo ? 'success' : 'warning',
    });
    toast.present();
  }

  get usuariosFiltrados(): Usuario[] {
    if (!this.filtroNome) return this.usuarios;
    const filtro = this.filtroNome.toLowerCase();
    return this.usuarios.filter(u => u.nome.toLowerCase().includes(filtro));
  }
}
