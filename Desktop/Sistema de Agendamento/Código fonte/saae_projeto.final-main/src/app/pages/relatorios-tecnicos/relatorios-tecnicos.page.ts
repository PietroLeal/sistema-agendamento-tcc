import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-relatorios-tecnicos',
  templateUrl: './relatorios-tecnicos.page.html',
  styleUrls: ['./relatorios-tecnicos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class RelatoriosTecnicosPage {
  form: FormGroup;
  carregando = false;
  relatorios: Array<{ usuario: string; acao: string; data: string }> = [];

  tiposLog = [
    { value: 'todos', label: 'Todos' },
    { value: 'logs', label: 'Logs de Sistema' },
    { value: 'actions', label: 'Ações de Usuários' },
    { value: 'errors', label: 'Erros & Exceções' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      tipoLog: ['todos'],
      dataInicio: [''],
      dataFim: [''],
      usuario: [''],
    });
  }

  gerarRelatorio() {
    if (this.carregando) return;

    this.carregando = true;
    this.relatorios = [];

    // Simular uma requisição/demora
    setTimeout(() => {
      // Dados fixos para simular o backend
      const dadosFicticios = [
        { usuario: 'ana.paula', acao: 'Login no sistema', data: '2025-07-15 08:00' },
        { usuario: 'joao.silva', acao: 'Alterou senha', data: '2025-07-15 09:15' },
        { usuario: 'maria.lima', acao: 'Cancelou agendamento', data: '2025-07-15 10:30' },
        { usuario: 'ana.paula', acao: 'Gerou relatório', data: '2025-07-21 11:45' },
      ];

      const f = this.form.value;

      // Função para verificar se texto contém termos relevantes para cada tipo
      const correspondeTipo = (acao: string, tipo: string) => {
        const a = acao.toLowerCase();
        if (tipo === 'todos') return true;
        if (tipo === 'logs') return a.includes('login') || a.includes('relatório');
        if (tipo === 'actions') return a.includes('alterou') || a.includes('gerou');
        if (tipo === 'errors') return a.includes('cancelou') || a.includes('erro');
        return false;
      };

      this.relatorios = dadosFicticios.filter(log => {
        if (!correspondeTipo(log.acao, f.tipoLog)) return false;

        if (f.usuario && !log.usuario.toLowerCase().includes(f.usuario.toLowerCase())) {
          return false;
        }

        // Comparar datas simples (formato YYYY-MM-DD ou YYYY-MM-DD HH:mm)
        if (f.dataInicio && log.data < f.dataInicio) return false;
        if (f.dataFim && log.data > f.dataFim) return false;

        return true;
      });

      this.carregando = false;
    }, 1500);
  }

  limparFiltros() {
    this.form.reset({
      tipoLog: 'todos',
      dataInicio: '',
      dataFim: '',
      usuario: '',
    });
    this.relatorios = [];
  }

  exportarCSV() {
    if (this.relatorios.length === 0) {
      alert('Nenhum dado para exportar.');
      return;
    }

    const csvRows = [
      ['Usuário', 'Ação', 'Data'], // cabeçalho
      ...this.relatorios.map(r => [r.usuario, r.acao, r.data])
    ];

    // Monta CSV escapando aspas
    const csvString = csvRows
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorios_tecnicos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
