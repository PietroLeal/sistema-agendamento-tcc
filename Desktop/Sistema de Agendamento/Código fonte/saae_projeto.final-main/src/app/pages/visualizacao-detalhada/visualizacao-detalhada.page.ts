import { Component } from '@angular/core'; 
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visualizacao-detalhada',
  templateUrl: './visualizacao-detalhada.page.html',
  styleUrls: ['./visualizacao-detalhada.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class VisualizacaoDetalhadaPage {
  reservas: any[] = [];

  prototipadas = [
    {
      data: '22/07/2025',
      horaInicio: '14:00',
      horaFim: '16:00',
      evento: 'Treinamento de Informática',
      segmento: 'Professores',
      qtdPessoas: 20,
      funcionario: 'João da Silva',
      sala: 'Laboratório de Informática 1',
      recursos: [
        { nome: 'Projetor', tipo: 'Fixo' },
        { nome: 'Computador', tipo: 'Móvel' }
      ]
    },
    {
      data: '24/07/2025',
      horaInicio: '08:00',
      horaFim: '10:00',
      evento: 'Apresentação de Projetos',
      segmento: 'Alunos 3º Ano',
      qtdPessoas: 35,
      funcionario: 'Maria Oliveira',
      sala: 'Sala de Vídeo 2',
      recursos: []
    },
    {
      data: '25/07/2025',
      horaInicio: '10:30',
      horaFim: '12:00',
      evento: 'Palestra Motivacional',
      segmento: 'Comunidade Escolar',
      qtdPessoas: 100,
      funcionario: 'Carlos Souza',
      sala: 'Auditório',
      recursos: [
        { nome: 'Microfone', tipo: 'Móvel' }
      ]
    },
    {
      data: '26/07/2025',
      horaInicio: '13:00',
      horaFim: '15:00',
      evento: 'Experiência de Ciências',
      segmento: 'Ensino Médio',
      qtdPessoas: 25,
      funcionario: 'Fernanda Lima',
      sala: 'Laboratório de Ciências',
      recursos: []
    }
  ];

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    const reservasSalvas = localStorage.getItem('reservas');
    if (reservasSalvas) {
      this.reservas = [...this.prototipadas, ...JSON.parse(reservasSalvas)];
    } else {
      this.reservas = [...this.prototipadas];
    }
  }

  voltar() {
    this.navCtrl.back();
  }

  // -------------------------------
  // Formata recursos para exibição
  // -------------------------------
  getRecursosFormatados(recursos: any[]): string {
    if (!recursos || recursos.length === 0) return 'Nenhum recurso solicitado';
    return recursos.map(r => `${r.nome} (${r.tipo})`).join(', ');
  }
}
