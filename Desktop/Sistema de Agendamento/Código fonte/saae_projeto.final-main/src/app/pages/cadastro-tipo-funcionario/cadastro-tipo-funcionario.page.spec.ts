import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroTipoFuncionarioPage } from './cadastro-tipo-funcionario.page';

describe('CadastroTipoFuncionarioPage', () => {
  let component: CadastroTipoFuncionarioPage;
  let fixture: ComponentFixture<CadastroTipoFuncionarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroTipoFuncionarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
