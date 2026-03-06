export interface Agendamento {
  idag: number;
  dataag: string;
  horainicioag: string;
  horafimag: string;
  eventoag: string;
  segmentoag: string;
  qtdpessoasag: number;
  statusag: 'Aprovado' | 'Pendente' | 'Cancelado';
  idf: number;
  ida: number;
}
