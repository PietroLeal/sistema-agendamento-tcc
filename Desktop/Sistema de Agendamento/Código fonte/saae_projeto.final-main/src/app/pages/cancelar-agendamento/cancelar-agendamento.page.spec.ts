import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CancelarAgendamentoPage } from './cancelar-agendamento.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('CancelarAgendamentoPage', () => {
  let component: CancelarAgendamentoPage;
  let fixture: ComponentFixture<CancelarAgendamentoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelarAgendamentoPage],
      imports: [IonicModule.forRoot(), CommonModule, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelarAgendamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado corretamente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir agendamentos', () => {
    expect(component.agendamentos.length).toBeGreaterThan(0);
  });

  it('deve cancelar um agendamento corretamente', () => {
    const idParaCancelar = component.agendamentos[0].id;
    component.cancelarAgendamento(idParaCancelar);
    expect(component.agendamentos.find(a => a.id === idParaCancelar)).toBeUndefined();
  });
});
