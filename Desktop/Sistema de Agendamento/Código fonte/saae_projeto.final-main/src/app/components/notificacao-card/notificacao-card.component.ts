import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificacao-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificacao-card.component.html'
})
export class NotificacaoCardComponent {
  @Input() notificacao: any;
}
