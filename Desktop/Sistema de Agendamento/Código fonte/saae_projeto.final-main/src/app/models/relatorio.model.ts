export interface Relatorio {
  idag: number;
  eventoag: string;
  segmentoag: string;
  dataag: string;
  horainicioag: string;
  horafimag: string;
  qtdpessoasag: number;
  statusag: string;

  responsavel?: string;
  ambiente?: string;

  datad?: string;
  horainiciod?: string;
  horafimd?: string;
}
