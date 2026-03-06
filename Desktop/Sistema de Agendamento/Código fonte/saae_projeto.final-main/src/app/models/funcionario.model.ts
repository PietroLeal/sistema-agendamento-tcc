import { Perfil } from './perfil.model';

export interface Funcionario {
  idf: number;
  nomef: string;
  emailf: string;
  telefonef: string;
  senhaf?: string; 
  perfis?: Perfil[];
}
