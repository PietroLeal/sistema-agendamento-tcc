import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroDisponibilidadePage } from './cadastro-disponibilidade.page';

describe('CadastroDisponibilidadePage', () => {
  let component: CadastroDisponibilidadePage;
  let fixture: ComponentFixture<CadastroDisponibilidadePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroDisponibilidadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
