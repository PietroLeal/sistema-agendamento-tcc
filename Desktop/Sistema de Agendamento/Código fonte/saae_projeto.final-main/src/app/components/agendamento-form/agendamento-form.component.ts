import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-agendamento-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agendamento-form.component.html'
})
export class AgendamentoFormComponent {
  @Input() data: any | null = null;
  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      usuario_id: [this.data?.usuario_id || '', Validators.required],
      ambiente_id: [this.data?.ambiente_id || '', Validators.required],
      inicio: [this.data?.inicio || '', Validators.required],
      fim: [this.data?.fim || '', Validators.required],
      descricao: [this.data?.descricao || '']
    });
  }

  submit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }
}
