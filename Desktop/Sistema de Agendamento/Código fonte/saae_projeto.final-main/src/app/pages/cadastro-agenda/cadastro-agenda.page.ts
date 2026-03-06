import { Component } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-agenda',
  templateUrl: './cadastro-agenda.page.html',
  styleUrls: ['./cadastro-agenda.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class CadastroAgendaPage {

  ambientes = [
    { nome: 'Auditório', icone: 'business-outline' },
    { nome: 'Sala de Vídeo 1', icone: 'tv-outline' },
    { nome: 'Sala de Vídeo 2', icone: 'tv-outline' },
    { nome: 'Sala de Vídeo 3', icone: 'tv-outline' },
    { nome: 'Lab. Informática 1', icone: 'laptop-outline' },
    { nome: 'Lab. Informática 2', icone: 'laptop-outline' },
    { nome: 'Lab. Informática 3', icone: 'laptop-outline' },
    { nome: 'Lab. Ciências', icone: 'flask-outline' }
  ];

  modalAberto = false;

  novoAmbiente = {
    nome: '',
    icone: ''
  };

  constructor(private router: Router) {}

  selecionarAmbiente(ambiente: any) {
    this.router.navigate(['/cadastro-disponibilidade'], { state: { ambiente } });
  }

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.novoAmbiente = { nome: '', icone: '' };
  }

  adicionarAmbiente() {
    if (this.novoAmbiente.nome && this.novoAmbiente.icone) {
      this.ambientes.push({ ...this.novoAmbiente });
      this.fecharModal();
    }
  }

  checkNotifications() {
    console.log('Verificando notificações...');
  }
}
