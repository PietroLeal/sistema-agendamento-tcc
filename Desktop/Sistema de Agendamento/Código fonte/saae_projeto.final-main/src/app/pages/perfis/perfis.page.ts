import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfis',
  templateUrl: './perfis.page.html',
  styleUrls: ['./perfis.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class PerfisPage {
  perfis: any[] = [];
  modalAberto = false;
  editando: number | null = null;
  form: any = { nome: '', permissoesObj: {} };

  permissoesDisponiveis: string[] = [];

  constructor(private alert: AlertController, private toast: ToastController) {
    // Carrega perfis
    const dadosPerfis = localStorage.getItem('perfis');
    this.perfis = dadosPerfis ? JSON.parse(dadosPerfis) : [];

    // Carrega permissões disponíveis (base + extras)
    const dadosPerms = localStorage.getItem('permissoesDisponiveis');
    this.permissoesDisponiveis = dadosPerms ? JSON.parse(dadosPerms) : [];
  }

  novoPerfil() {
    this.form = { nome: '', permissoesObj: {} };
    this.editando = null;
    this.modalAberto = true;
  }

  editarPerfil(i: number) {
    const perfil = this.perfis[i];
    const permissoesObj: any = {};
    this.permissoesDisponiveis.forEach(p => permissoesObj[p] = perfil.permissoes?.includes(p) || false);
    this.form = { nome: perfil.nome, permissoesObj };
    this.editando = i;
    this.modalAberto = true;
  }

  salvarPerfil() {
    if (!this.form.nome?.trim()) return;

    const permissoesSelecionadas = this.permissoesDisponiveis.filter(p => this.form.permissoesObj[p]);

    const perfilFinal = {
      nome: this.form.nome,
      permissoes: permissoesSelecionadas
    };

    if (this.editando !== null) this.perfis[this.editando] = perfilFinal;
    else this.perfis.push(perfilFinal);

    localStorage.setItem('perfis', JSON.stringify(this.perfis));

    this.modalAberto = false;
    this.toast.create({ message: 'Perfil salvo', duration: 1500 }).then(t => t.present());
  }

  async excluirPerfil(i: number) {
    const alert = await this.alert.create({
      header: 'Excluir Perfil',
      message: `Deseja remover o perfil <b>${this.perfis[i].nome}</b>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.perfis.splice(i, 1);
            localStorage.setItem('perfis', JSON.stringify(this.perfis));
          }
        }
      ]
    });
    await alert.present();
  }
}
