import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-permissoes',
  templateUrl: './permissoes.page.html',
  styleUrls: ['./permissoes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class PermissoesPage {

  permissoes: string[] = [];
  modalAberto = false;
  form: any = { nomperm: '' };
  editando: number | null = null;

  // Permissões base fixas
  permissoesBase: string[] = [
    'Agendar',
    'Gerenciar Usuários',
    'Criar Relatórios',
    'Gerenciar Professores',
    'Consultar Agendamentos',
    'Gerenciar Salas',
    'Visualização Detalhada',
    'Gerenciar Perfil',
    'Gerenciar Disponibilidade',
    'Gerenciar Permissões'
  ];

  constructor(private alert: AlertController, private toast: ToastController) {
    // Carregar permissões extras do localStorage
    const extras = JSON.parse(localStorage.getItem('permissoesExtras') || '[]');
    this.permissoes = [...this.permissoesBase, ...extras];
  }

  novo() {
    this.form = { nomperm: '' };
    this.editando = null;
    this.modalAberto = true;
  }

  editar(i: number) {
    this.form = { nomperm: this.permissoes[i] };
    this.editando = i;
    this.modalAberto = true;
  }

  async salvar() {
    if (!this.form.nomperm?.trim()) return;

    if (this.editando !== null) {
      this.permissoes[this.editando] = this.form.nomperm;
    } else {
      this.permissoes.push(this.form.nomperm);
    }

    // Atualiza permissões extras no localStorage
    this.salvarExtras();

    this.modalAberto = false;
    const toastEl = await this.toast.create({ message: 'Permissão salva', duration: 1500, color: 'success' });
    await toastEl.present();
  }

  async excluir(i: number) {
    const alert = await this.alert.create({
      header: 'Excluir',
      message: `Remover a permissão <b>${this.permissoes[i]}</b>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            const permRemovida = this.permissoes[i];
            this.permissoes.splice(i, 1);

            // Atualiza extras no localStorage
            this.salvarExtras();

            // Atualiza perfis: remove a permissão de todos os perfis
            const perfis = JSON.parse(localStorage.getItem('perfis') || '[]');
            const perfisAtualizados = perfis.map((p: any) => ({
              ...p,
              permissoes: p.permissoes.filter((perm: string) => perm !== permRemovida)
            }));
            localStorage.setItem('perfis', JSON.stringify(perfisAtualizados));
          }
        }
      ]
    });
    await alert.present();
  }

  private salvarExtras() {
    // Salva apenas as permissões extras (não base)
    const extras = this.permissoes.filter(p => !this.permissoesBase.includes(p));
    localStorage.setItem('permissoesExtras', JSON.stringify(extras));

    // Salva lista completa de permissões para os perfis
    localStorage.setItem('permissoesDisponiveis', JSON.stringify(this.permissoes));
  }
}
