import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestao-prof',
  template: `
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>Gestão de Professores</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <ion-card>
    <ion-card-header>
      <ion-card-title>Lista de Professores</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-list>
        <ion-item *ngFor="let prof of professores">
          <ion-label>
            <h2>{{ prof.nome }}</h2>
            <p><strong>Telefone:</strong> {{ prof.telefone }}</p>
            <p><strong>Email:</strong> {{ prof.email }}</p>
            <p>Status:
              <strong [ngClass]="{ 'ativo': prof.ativo, 'inativo': !prof.ativo }">
                {{ prof.ativo ? 'Ativo' : 'Inativo' }}
              </strong>
            </p>
          </ion-label>

          <!-- Botão ativar/desativar -->
          <ion-button fill="clear" color="success" (click)="ativarDesativar(prof)">
            <ion-icon [name]="prof.ativo ? 'lock-closed-outline' : 'lock-open-outline'" slot="icon-only"></ion-icon>
          </ion-button>

          <!-- Botão editar -->
          <ion-button fill="clear" color="primary" (click)="editarProfessor(prof)">
            <ion-icon name="create-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item *ngIf="professores.length === 0">
          <ion-label color="medium" class="ion-text-center">
            Nenhum professor cadastrado ainda.
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-card-content>
  </ion-card>

  <ion-button expand="block" color="primary" (click)="abrirModalCadastro()">
    <ion-icon name="add-circle" slot="start"></ion-icon>
    Adicionar Novo Professor
  </ion-button>
</ion-content>
  `,
  styleUrls: ['./gestao-prof.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class GestaoProfPage implements OnInit {
  professores: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.carregarProfessores();
  }

  ionViewWillEnter() {
    // Atualiza sempre que a página for aberta
    this.carregarProfessores();
  }

  carregarProfessores() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    this.professores = usuarios
      .filter((u: any) => u.nivel === 'Professor')
      .map((u: any) => ({
        nome: u.nome,
        telefone: u.telefone,
        email: u.email,
        ativo: u.ativo,
      }));
  }

  ativarDesativar(professor: any) {
    professor.ativo = !professor.ativo;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioAlvo = usuarios.find((u: any) => u.email === professor.email);
    if (usuarioAlvo) {
      usuarioAlvo.ativo = professor.ativo;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }

  editarProfessor(professor: any) {
    this.modalCtrl.create({
      component: CadastroProfessorModal,
      componentProps: { professor },
      cssClass: 'modal-cadastro-professor'
    }).then(modal => {
      modal.onDidDismiss().then(res => {
        if (res.data) {
          Object.assign(professor, res.data);
          this.atualizarProfessorStorage(professor);
        }
      });
      modal.present();
    });
  }

  atualizarProfessorStorage(professor: any) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex((u: any) => u.email === professor.email);
    if (index > -1) {
      usuarios[index] = { ...usuarios[index], ...professor };
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }

  async abrirModalCadastro() {
    const modal = await this.modalCtrl.create({
      component: CadastroProfessorModal,
      cssClass: 'modal-cadastro-professor',
    });

    modal.onDidDismiss().then(res => {
      if (res.data) {
        this.professores.push(res.data);

        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        usuarios.push({
          id: usuarios.length ? Math.max(...usuarios.map((u: any) => u.id)) + 1 : 1,
          nome: res.data.nome,
          email: res.data.email,
          telefone: res.data.telefone,
          senha: res.data.senha,
          nivel: 'Professor',
          ativo: true
        });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
    });

    await modal.present();
  }
}

@Component({
  selector: 'app-cadastro-professor-modal',
  template: `
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>{{ professor ? 'Editar Professor' : 'Novo Professor' }}</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="fechar()">Fechar</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <form [formGroup]="form" (ngSubmit)="salvar()">
    <ion-item>
      <ion-label position="floating">Nome</ion-label>
      <ion-input formControlName="nome"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="floating">Telefone</ion-label>
      <ion-input type="tel" formControlName="telefone"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="floating">E-mail</ion-label>
      <ion-input type="email" formControlName="email"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="floating">Senha</ion-label>
      <ion-input [type]="mostrarSenha ? 'text' : 'password'" formControlName="senha"></ion-input>
      <ion-button fill="clear" slot="end" size="small" type="button" (click)="mostrarSenha = !mostrarSenha">
        <ion-icon [name]="mostrarSenha ? 'eye-off' : 'eye'" slot="icon-only"></ion-icon>
      </ion-button>
      <p *ngIf="professor" class="ion-text-caption">Deixe vazio para manter a senha atual</p>
    </ion-item>

    <ion-button expand="block" type="submit" [disabled]="form.invalid">Salvar</ion-button>
  </form>
</ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class CadastroProfessorModal implements OnInit {
  @Input() professor: any;
  form: FormGroup;
  mostrarSenha = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.minLength(6)]
    });
  }

  ngOnInit() {
    if (this.professor) {
      this.form.patchValue({
        nome: this.professor.nome,
        telefone: this.professor.telefone,
        email: this.professor.email,
      });
      this.form.get('senha')?.clearValidators();
      this.form.get('senha')?.updateValueAndValidity();
    }
  }

  fechar() {
    this.modalCtrl.dismiss();
  }

  salvar() {
    if (this.form.valid) {
      const dados = this.form.value;
      const professorEditado = {
        ...dados,
        ativo: this.professor ? this.professor.ativo : true
      };
      this.modalCtrl.dismiss(professorEditado);
    }
  }
}
