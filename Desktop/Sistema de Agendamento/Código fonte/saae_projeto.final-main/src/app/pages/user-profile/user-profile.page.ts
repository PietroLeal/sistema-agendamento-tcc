import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit {
  form!: FormGroup;
  private fb = inject(FormBuilder);
  private toastCtrl = inject(ToastController);

  ngOnInit() {
    // Pega o usuário logado do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

    this.form = this.fb.group({
      nome: [usuarioLogado.nome || '', Validators.required],
      email: [usuarioLogado.email || '', [Validators.required, Validators.email]],
      telefone: [usuarioLogado.telefone || '', Validators.required]
    });
  }

  async salvar() {
    // Atualiza o usuário logado no localStorage
    const usuarioAtualizado = { ...JSON.parse(localStorage.getItem('usuarioLogado') || '{}'), ...this.form.value };
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));

    // Também atualiza a lista de usuários salvos
    const usuariosSalvos: any[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuariosSalvos.findIndex(u => u.id === usuarioAtualizado.id);
    if (index > -1) {
      usuariosSalvos[index] = usuarioAtualizado;
      localStorage.setItem('usuarios', JSON.stringify(usuariosSalvos));
    }

    const toast = await this.toastCtrl.create({
      message: 'Alterações salvas com sucesso!',
      duration: 2000,
      color: 'success'
    });
    toast.present();

    console.log('Dados atualizados:', usuarioAtualizado);
  }
}
