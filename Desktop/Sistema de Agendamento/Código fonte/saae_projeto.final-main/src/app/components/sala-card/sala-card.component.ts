import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sala-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sala-card.component.html'
})
export class SalaCardComponent {
  @Input() sala: any;
}
