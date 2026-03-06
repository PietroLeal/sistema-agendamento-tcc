import { Component } from '@angular/core';
import { ToastController, AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-consulta-agendamentos',
  templateUrl: './consulta-agendamentos.page.html',
  styleUrls: ['./consulta-agendamentos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ConsultaAgendamentosPage {
  dataInicio = '';
  dataFim = '';
  salaSelecionada = '';
  tipoRelatorio: 'geral' | 'recursos' | 'disponibilidade' = 'geral';

  salas = ['Auditório', 'Sala de Vídeo', 'Laboratório de Informática', 'Laboratório de Química'];

  agendamentos = [
    { data: '10/09/2025', horaInicio: '08:00', horaFim: '12:00', sala: 'Auditório', evento: 'Semana da Educação', segmento: 'Pedagogia', qtdPessoas: 100, funcionario: 'Érika', recursos: ['Microfone','Projetor'], status: 'Aprovado' },
    { data: '12/09/2025', horaInicio: '09:00', horaFim: '11:00', sala: 'Sala de Vídeo', evento: 'Aula de Informática', segmento: 'Técnico em Informática', qtdPessoas: 30, funcionario: 'Joélio', recursos: ['Computador','Projetor'], status: 'Aprovado' },
    { data: '15/09/2025', horaInicio: '14:00', horaFim: '16:00', sala: 'Laboratório de Química', evento: 'Experimento Químico', segmento: 'Normal Médio', qtdPessoas: 25, funcionario: 'Alexandre', recursos: ['Quadro Branco','Kit Químico'], status: 'Concluído' },
    { data: '18/09/2025', horaInicio: '08:30', horaFim: '10:30', sala: 'Laboratório de Informática', evento: 'Oficina de Programação', segmento: 'Ensino Médio', qtdPessoas: 20, funcionario: 'Camila', recursos: ['Computador','Projetor'], status: 'Aprovado' },
    { data: '21/09/2025', horaInicio: '13:00', horaFim: '15:00', sala: 'Auditório', evento: 'Palestra Motivacional', segmento: 'Formação Geral', qtdPessoas: 120, funcionario: 'Érika', recursos: ['Microfone','Projetor'], status: 'Aprovado' },
    { data: '25/09/2025', horaInicio: '09:00', horaFim: '11:00', sala: 'Sala de Vídeo', evento: 'Reunião Pedagógica', segmento: 'Fundamental I', qtdPessoas: 35, funcionario: 'Marcelo', recursos: ['Projetor','Computador'], status: 'Cancelado' },
    { data: '30/09/2025', horaInicio: '10:00', horaFim: '12:00', sala: 'Laboratório de Química', evento: 'Oficina Ciências', segmento: 'Fundamental II', qtdPessoas: 28, funcionario: 'Sandra', recursos: ['Quadro Branco','Kit Científico'], status: 'Pendente' },
    { data: '03/10/2025', horaInicio: '08:00', horaFim: '10:00', sala: 'Laboratório de Informática', evento: 'Aula de Programação', segmento: 'Técnico em Informática', qtdPessoas: 25, funcionario: 'Camila', recursos: ['Computador','Projetor'], status: 'Aprovado' },
    { data: '07/10/2025', horaInicio: '14:00', horaFim: '17:00', sala: 'Auditório', evento: 'Palestra Final', segmento: 'Pedagogia', qtdPessoas: 120, funcionario: 'Érika', recursos: ['Microfone','Projetor'], status: 'Aprovado' }
  ];

  disponibilidades = [
    { data: '10/09/2025', sala: 'Auditório', totalSlots: 10, usados: 8 },
    { data: '18/09/2025', sala: 'Sala de Vídeo', totalSlots: 8, usados: 5 },
    { data: '25/09/2025', sala: 'Laboratório de Química', totalSlots: 6, usados: 4 },
    { data: '03/10/2025', sala: 'Laboratório de Informática', totalSlots: 5, usados: 3 },
    { data: '07/10/2025', sala: 'Auditório', totalSlots: 10, usados: 9 }
  ];

  recursosUso = [
    { data: '10/09/2025', recurso: 'Projetor', ambiente: 'Sala de Vídeo', vezes: 6 },
    { data: '12/09/2025', recurso: 'Computador', ambiente: 'Laboratório de Informática', vezes: 5 },
    { data: '15/09/2025', recurso: 'Quadro Branco', ambiente: 'Laboratório de Química', vezes: 5 },
    { data: '18/09/2025', recurso: 'Computador', ambiente: 'Laboratório de Informática', vezes: 8 },
    { data: '21/09/2025', recurso: 'Microfone', ambiente: 'Auditório', vezes: 10 },
    { data: '25/09/2025', recurso: 'Projetor', ambiente: 'Sala de Vídeo', vezes: 4 },
    { data: '30/09/2025', recurso: 'Quadro Branco', ambiente: 'Laboratório de Química', vezes: 6 },
    { data: '03/10/2025', recurso: 'Computador', ambiente: 'Laboratório de Informática', vezes: 7 },
    { data: '07/10/2025', recurso: 'Microfone', ambiente: 'Auditório', vezes: 5 }
  ];

  agendamentosFiltrados: any[] = [];

  constructor(private toastCtrl: ToastController, private alertCtrl: AlertController) {}

  private toISO(dataBR: string): string {
    const [dia, mes, ano] = dataBR.split('/');
    return `${ano}-${mes}-${dia}`;
  }

  private obterTituloRelatorio(): string {
    switch (this.tipoRelatorio) {
      case 'disponibilidade': return 'Ambientes e Disponibilidade';
      case 'recursos': return 'Agendamento de Recursos';
      default: return 'Relatórios Gerenciais';
    }
  }

  gerarRelatorio() {
    const inicioISO = this.dataInicio ? this.dataInicio : '0000-01-01';
    const fimISO = this.dataFim ? this.dataFim : '9999-12-31';
    const converte = (d: string) => this.toISO(d);

    switch (this.tipoRelatorio) {
      case 'disponibilidade':
        this.agendamentosFiltrados = this.disponibilidades
          .filter(d => converte(d.data) >= inicioISO && converte(d.data) <= fimISO)
          .map(d => ({ data: d.data, sala: d.sala, ocupacao: ((d.usados / d.totalSlots) * 100).toFixed(1) + '%' }));
        break;

      case 'recursos':
        this.agendamentosFiltrados = this.recursosUso
          .filter(r => converte(r.data) >= inicioISO && converte(r.data) <= fimISO)
          .map(r => ({ data: r.data, recurso: r.recurso, ambiente: r.ambiente, vezes: r.vezes }));
        break;

      default:
        this.agendamentosFiltrados = this.agendamentos
          .filter(item => {
            const dataOk = converte(item.data) >= inicioISO && converte(item.data) <= fimISO;
            const salaOk = this.salaSelecionada ? item.sala === this.salaSelecionada : true;
            return dataOk && salaOk;
          });
        break;
    }
    this.toast('✅ Consulta realizada com sucesso!');
  }

  // ✅ Método corrigido — agora existe e atualiza o status corretamente
  async atualizarStatus(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Alterar Status',
      message: `Selecione o novo status para o agendamento de <strong>${item.sala}</strong>:`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aprovado ✅',
          handler: () => { item.status = 'Aprovado'; this.toast('✅ Status alterado para Aprovado'); }
        },
        {
          text: 'Pendente ⏳',
          handler: () => { item.status = 'Pendente'; this.toast('⏳ Status alterado para Pendente'); }
        },
        {
          text: 'Cancelado ❌',
          handler: () => { item.status = 'Cancelado'; this.toast('❌ Status alterado para Cancelado'); }
        },
      ]
    });

    await alert.present();
  }

  async exportarExcel() {
    if (this.agendamentosFiltrados.length === 0)
      return this.toast('⚠️ Nenhum dado para exportar!', 'warning');

    const titulo = this.obterTituloRelatorio();
    const instituicao = 'Instituto Superior de Educação Professor Aldo Muylaert - FAETEC';
    const dataGeracao = new Date().toLocaleDateString();

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      [instituicao],
      [titulo],
      [`Gerado em: ${dataGeracao}`],
      []
    ]);

    let dados: any[] = [];
    if (this.tipoRelatorio === 'disponibilidade') {
      dados.push(['Data', 'Sala', 'Ocupação']);
      this.agendamentosFiltrados.forEach(a => dados.push([a.data, a.sala, a.ocupacao]));
    } else if (this.tipoRelatorio === 'recursos') {
      dados.push(['Data', 'Recurso', 'Ambiente', 'Vezes Utilizado']);
      this.agendamentosFiltrados.forEach(a => dados.push([a.data, a.recurso, a.ambiente, a.vezes]));
    } else {
      dados.push(['Data','Início','Fim','Sala','Evento','Segmento','Qtd Pessoas','Funcionário','Recursos','Status']);
      this.agendamentosFiltrados.forEach(a =>
        dados.push([a.data,a.horaInicio,a.horaFim,a.sala,a.evento,a.segmento,a.qtdPessoas,a.funcionario,a.recursos ? a.recursos.join(', ') : a.recursosStr,a.status])
      );
    }

    XLSX.utils.sheet_add_aoa(ws, dados, { origin: -1 });
    ws['!cols'] = dados[0].map(() => ({ wch: 18 }));

    XLSX.utils.book_append_sheet(wb, ws, 'Consulta');
    XLSX.writeFile(wb, 'consulta.xlsx');
    this.toast('📁 Excel exportado com sucesso!', 'success');
  }

  async exportarPDF() {
    if (this.agendamentosFiltrados.length === 0)
      return this.toast('⚠️ Nenhum dado para exportar!', 'warning');

    const doc = new jsPDF();
    const titulo = this.obterTituloRelatorio();
    const instituicao = 'Instituto Superior de Educação Professor Aldo Muylaert - FAETEC';
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(instituicao, pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(15);
    doc.text(titulo, pageWidth / 2, 25, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, pageWidth - 10, 32, { align: 'right' });

    let colunas: string[] = [];
    let linhas: any[][] = [];

    if (this.tipoRelatorio === 'disponibilidade') {
      colunas = ['Data', 'Sala', 'Ocupação'];
      linhas = this.agendamentosFiltrados.map(d => [d.data, d.sala, d.ocupacao]);
    } else if (this.tipoRelatorio === 'recursos') {
      colunas = ['Data', 'Recurso', 'Ambiente', 'Vezes Utilizado'];
      linhas = this.agendamentosFiltrados.map(d => [d.data, d.recurso, d.ambiente, d.vezes]);
    } else {
      colunas = ['Data','Início','Fim','Sala','Evento','Segmento','Qtd Pessoas','Funcionário','Recursos','Status'];
      linhas = this.agendamentosFiltrados.map(d => [
        d.data, d.horaInicio, d.horaFim, d.sala, d.evento, d.segmento, d.qtdPessoas,
        d.funcionario, d.recursos ? d.recursos.join(', ') : d.recursosStr, d.status
      ]);
    }

    autoTable(doc, {
      head: [colunas],
      body: linhas,
      startY: 40,
      styles: { fontSize: 9, halign: 'center' },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save('consulta.pdf');
    this.toast('📄 PDF exportado com sucesso!', 'success');
  }

  async toast(msg: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
