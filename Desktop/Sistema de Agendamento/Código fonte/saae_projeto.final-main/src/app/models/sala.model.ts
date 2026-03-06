import { Recurso } from './recurso.model';

export interface Sala {
  ida: number;
  nomea: string;
  descricaoa: string;
  numeroa: number;
  capacidadea: number;
  tipoambiente: string; 
  recursos?: Recurso[];
}
