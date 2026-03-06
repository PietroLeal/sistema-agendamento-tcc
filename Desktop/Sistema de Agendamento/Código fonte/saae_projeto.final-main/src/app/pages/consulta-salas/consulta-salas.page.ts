import { Component } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Sala {
  id: number;
  nome: string;
  descricao: string;
  numero: number;
  capacidade: number;
  tipoAmbiente: string;
  icone?: string;
}

@Component({
  selector: 'app-consulta-salas',
  templateUrl: './consulta-salas.page.html',
  styleUrls: ['./consulta-salas.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ConsultaSalasPage {

  salas: Sala[] = [];

  constructor(private alertController: AlertController, private toastController: ToastController) {
    this.carregarSalas();
  }

  // Carrega do localStorage ou inicializa padrões
  carregarSalas() {
    const salasSalvas = localStorage.getItem('salas');
    if (salasSalvas) {
      this.salas = JSON.parse(salasSalvas);
    } else {
      this.salas = [
        { id: 1, nome: 'Auditório', descricao: 'Espaço para grandes eventos', numero: 1, capacidade: 200, tipoAmbiente: 'Auditório', icone: 'business-outline' },
        { id: 2, nome: 'Laboratório 1', descricao: 'Laboratório de informática', numero: 1, capacidade: 30, tipoAmbiente: 'Laboratório', icone: 'laptop-outline' },
        { id: 3, nome: 'Laboratório 2', descricao: 'Laboratório de informática avançado', numero: 2, capacidade: 25, tipoAmbiente: 'Laboratório', icone: 'laptop-outline' },
        { id: 4, nome: 'Laboratório 3', descricao: 'Laboratório de programação', numero: 3, capacidade: 20, tipoAmbiente: 'Laboratório', icone: 'laptop-outline' },
        { id: 5, nome: 'Sala de Vídeo 1', descricao: 'Sala para gravação e edição', numero: 1, capacidade: 15, tipoAmbiente: 'Sala de Vídeo', icone: 'videocam-outline' },
        { id: 6, nome: 'Sala de Vídeo 2', descricao: 'Sala com projetor e tela', numero: 2, capacidade: 15, tipoAmbiente: 'Sala de Vídeo', icone: 'videocam-outline' },
        { id: 7, nome: 'Sala de Vídeo 3', descricao: 'Sala multimídia', numero: 3, capacidade: 15, tipoAmbiente: 'Sala de Vídeo', icone: 'videocam-outline' },
        { id: 8, nome: 'Laboratório de Ciências', descricao: 'Laboratório com equipamentos para experimentos', numero: 1, capacidade: 25, tipoAmbiente: 'Laboratório', icone: 'flask-outline' }
      ];
      this.salvarSalas();
    }
  }

  // Salva no localStorage
  salvarSalas() {
    localStorage.setItem('salas', JSON.stringify(this.salas));
  }

  async verDetalhes(sala: Sala) {
    const alert = await this.alertController.create({
      header: 'Detalhes do Ambiente',
      message: `
        <strong>Nome:</strong> ${sala.nome}<br>
        <strong>Descrição:</strong> ${sala.descricao || '-'}<br>
        <strong>Número:</strong> ${sala.numero}<br>
        <strong>Capacidade:</strong> ${sala.capacidade}<br>
        <strong>Tipo:</strong> ${sala.tipoAmbiente}
      `,
      buttons: ['OK']
    });
    await alert.present();
  }

  async criarSala() {
    const alert = await this.alertController.create({
      header: 'Criar Novo Ambiente',
      inputs: [
        { name: 'nome', type: 'text', placeholder: 'Nome do ambiente' },
        { name: 'descricao', type: 'text', placeholder: 'Descrição' },
        { name: 'numero', type: 'number', placeholder: 'Número' },
        { name: 'capacidade', type: 'number', placeholder: 'Capacidade' },
        { name: 'tipoAmbiente', type: 'text', placeholder: 'Tipo de Ambiente' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Criar',
          handler: async (data) => {
            if (!data.nome || !data.numero) {
              const toast = await this.toastController.create({
                message: 'Nome e número são obrigatórios.',
                duration: 2000,
                color: 'warning'
              });
              await toast.present();
              return false;
            }

            const novoId = this.salas.length > 0 ? Math.max(...this.salas.map(s => s.id)) + 1 : 1;
            this.salas.push({ id: novoId, icone: undefined, ...data });

            // Salva no localStorage
            this.salvarSalas();

            const toast = await this.toastController.create({
              message: 'Ambiente criado com sucesso!',
              duration: 2000,
              color: 'success'
            });
            await toast.present();
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async editarSala(sala: Sala) {
    const alert = await this.alertController.create({
      header: 'Editar Ambiente',
      inputs: [
        { name: 'nome', type: 'text', placeholder: 'Nome', value: sala.nome },
        { name: 'descricao', type: 'text', placeholder: 'Descrição', value: sala.descricao },
        { name: 'numero', type: 'number', placeholder: 'Número', value: sala.numero },
        { name: 'capacidade', type: 'number', placeholder: 'Capacidade', value: sala.capacidade },
        { name: 'tipoAmbiente', type: 'text', placeholder: 'Tipo de Ambiente', value: sala.tipoAmbiente }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: async (data) => {
            Object.assign(sala, data);

            // Atualiza localStorage
            this.salvarSalas();

            const toast = await this.toastController.create({
              message: 'Ambiente atualizado com sucesso!',
              duration: 2000,
              color: 'success'
            });
            await toast.present();
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async excluirSala(sala: Sala) {
    const alert = await this.alertController.create({
      header: 'Excluir Ambiente',
      message: `Deseja realmente excluir o ambiente "${sala.nome}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: async () => {
            this.salas = this.salas.filter(s => s.id !== sala.id);

            // Atualiza localStorage
            this.salvarSalas();

            const toast = await this.toastController.create({
              message: 'Ambiente excluído com sucesso!',
              duration: 2000,
              color: 'danger'
            });
            await toast.present();
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  // Exportações
  exportarParaExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.salas);
    const workbook = { Sheets: { 'Ambientes': worksheet }, SheetNames: ['Ambientes'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.salvarArquivo(excelBuffer, 'ambientes.xlsx', 'application/octet-stream');
  }

  exportarParaPDF() {
    const doc = new jsPDF();
    const colunas = ['Nome', 'Descrição', 'Número', 'Capacidade', 'Tipo de Ambiente'];
    const linhas = this.salas.map(s => [s.nome, s.descricao, s.numero, s.capacidade, s.tipoAmbiente]);
    autoTable(doc, { head: [colunas], body: linhas });
    doc.save('ambientes.pdf');
  }

  salvarArquivo(buffer: any, fileName: string, fileType: string) {
    const data: Blob = new Blob([buffer], { type: fileType });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = fileName;
    link.click();
  }
}
