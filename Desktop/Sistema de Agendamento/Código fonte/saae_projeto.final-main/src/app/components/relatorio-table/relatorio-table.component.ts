import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatorio-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorio-table.component.html'
})
export class RelatorioTableComponent {
  @Input() dados: any[] = [];
}
