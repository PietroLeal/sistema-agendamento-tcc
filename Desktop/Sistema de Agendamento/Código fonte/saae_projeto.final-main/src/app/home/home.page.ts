import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AgendamentoService } from '../../services/agendamento.service';
import { AmbientesService } from '../../services/ambientes.service';
import { NotificacaoService } from '../../services/notificacao.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  usuarioNome: string = '';
  agendamentosHoje: any[] = [];
  ambientesMaisUsados: any[] = [];
  notificacoes: any[] = [];

  carregando: boolean = true;

  constructor(
    private authService: AuthService,
    private agendamentoService: AgendamentoService,
    private ambienteService: AmbientesService,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit() {
    this.usuarioNome = this.authService.getUserName();

    this.carregarDados();
  }

  carregarDados() {
    this.carregando = true;

    Promise.all([
      this.agendamentoService.getAgendamentosDoDia().toPromise(),
      this.ambienteService.getAmbientesMaisUsados().toPromise(),
      this.notificacaoService.getNotificacoes().toPromise()
    ])
      .then(([agendamentos, ambientes, notificacoes]) => {
        this.agendamentosHoje = agendamentos || [];
        this.ambientesMaisUsados = ambientes || [];
        this.notificacoes = notificacoes || [];
      })
      .finally(() => {
        this.carregando = false;
      });
  }

  logout() {
    this.authService.logout();
  }
}
