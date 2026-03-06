import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

interface Permissao {
  nome: string;
  descricao: string;
}

@Component({
  standalone: true,
  selector: 'app-controle-acesso',
  templateUrl: './controle-acesso.page.html',
  styleUrls: ['./controle-acesso.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class ControleAcessoPage implements OnInit {
  niveis: string[] = ['Administrador', 'Coordenador', 'Professor'];

  permissoes: Permissao[] = [
    { nome: 'gerenciarUsuarios', descricao: 'Gerenciar Usuários' },
    { nome: 'cadastrarSalas', descricao: 'Cadastrar Salas' },
    { nome: 'cadastrarAgendas', descricao: 'Cadastrar Agendas' },
    { nome: 'consultarAgendamentos', descricao: 'Consultar Agendamentos' },
    { nome: 'gerarRelatorios', descricao: 'Gerar Relatórios' },
  ];

  formularioPermissoes: { [nivel: string]: FormGroup } = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Inicializa os formulários de cada nível
    this.niveis.forEach(nivel => {
      this.formularioPermissoes[nivel] = this.fb.group(
        this.permissoes.reduce((acc, permissao) => {
          acc[permissao.nome] = this.fb.control(false);
          return acc;
        }, {} as any)
      );
    });
  }

  salvarPermissoes() {
    const dadosSalvos = this.niveis.reduce((acc, nivel) => {
      acc[nivel] = this.formularioPermissoes[nivel].value;
      return acc;
    }, {} as any);

    console.log('Permissões salvas:', dadosSalvos);
    // Aqui você pode fazer um POST para o backend com essas permissões
  }
}
