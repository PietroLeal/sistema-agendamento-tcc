import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

// Importações para exportação
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-consulta-disponibilidade',
  templateUrl: './consulta-disponibilidade.page.html',
  styleUrls: ['./consulta-disponibilidade.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class ConsultaDisponibilidadePage {

  // Lista de opções de filtro principal
  tipoConsultaSelecionado: string = '';

  tiposConsulta = [
    'Consulta de ambientes e disponibilidade',
    'Consulta de relatórios gerenciais',
    'Consulta de agendamentos e recursos'
  ];

  // Dados simulados (exemplo similar ao módulo de relatórios)
  disponibilidades = [
    { id: 1, data: '2025-06-10', horaInicio: '08:00', horaFim: '08:50', sala: 'Auditório', status: 'Disponível', funcionario: 'João Silva' },
    { id: 2, data: '2025-06-11', horaInicio: '10:00', horaFim: '10:50', sala: 'Lab. Informática', status: 'Indisponível', funcionario: 'Maria Souza' },
    { id: 3, data: '2025-06-12', horaInicio: '14:00', horaFim: '14:50', sala: 'Sala de Vídeo', status: 'Disponível', funcionario: 'Carlos Lima' }
  ];

  disponibilidadesFiltradas = [...this.disponibilidades];

  // Filtros adicionais
  filtroData: string = '';
  salaSelecionada: string = '';

  salas = ['Auditório', 'Lab. Informática', 'Sala de Vídeo'];

  constructor(private alertController: AlertController, private toastController: ToastController) {}

  filtrarDisponibilidades(): void {
    // Apenas filtra se houver tipo de consulta selecionado
    if (!this.tipoConsultaSelecionado) {
      this.disponibilidadesFiltradas = [];
      return;
    }

    this.disponibilidadesFiltradas = this.disponibilidades.filter(d => {
      const salaOk = this.salaSelecionada ? d.sala === this.salaSelecionada : true;
      const dataOk = this.filtroData ? d.data === this.filtroData : true;
      return salaOk && dataOk;
    });
  }

  async verDetalhes(disponibilidade: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Detalhes',
      message: `
        <strong>Sala:</strong> ${disponibilidade.sala}<br>
        <strong>Data:</strong> ${disponibilidade.data}<br>
        <strong>Horário:</strong> ${disponibilidade.horaInicio} - ${disponibilidade.horaFim}<br>
        <strong>Status:</strong> ${disponibilidade.status}<br>
        <strong>Funcionário:</strong> ${disponibilidade.funcionario}
      `,
      buttons: ['OK']
    });
    await alert.present();
  }

  async alterarStatus(disponibilidade: any): Promise<void> {
    const novoStatus = disponibilidade.status === 'Disponível' ? 'Indisponível' : 'Disponível';
    const alert = await this.alertController.create({
      header: 'Alterar Status',
      message: `Deseja alterar o status para <strong>${novoStatus}</strong>?`,
      buttons: [
        { text: 'Não', role: 'cancel' },
        {
          text: 'Sim',
          handler: async () => {
            disponibilidade.status = novoStatus;
            this.filtrarDisponibilidades();
            const toast = await this.toastController.create({
              message: `Status alterado para ${novoStatus}!`,
              duration: 2000,
              color: 'success',
              position: 'top'
            });
            await toast.present();
          }
        }
      ]
    });
    await alert.present();
  }

  exportarParaExcel(): void {
    if (this.disponibilidadesFiltradas.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(this.disponibilidadesFiltradas);
    const workbook = { Sheets: { 'Disponibilidades': worksheet }, SheetNames: ['Disponibilidades'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.salvarArquivo(excelBuffer, 'disponibilidades.xlsx', 'application/octet-stream');
  }

  exportarParaPDF(): void {
    if (this.disponibilidadesFiltradas.length === 0) return;

    const doc = new jsPDF();
    const colunas = ['Data', 'Horário Início', 'Horário Fim', 'Sala', 'Status', 'Funcionário'];
    const linhas = this.disponibilidadesFiltradas.map(d => [
      d.data,
      d.horaInicio,
      d.horaFim,
      d.sala,
      d.status,
      d.funcionario
    ]);

    autoTable(doc, { head: [colunas], body: linhas });
    doc.save('disponibilidades.pdf');
  }

  salvarArquivo(buffer: any, fileName: string, fileType: string): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = fileName;
    link.click();
  }
}
