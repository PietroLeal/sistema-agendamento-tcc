import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestaoProfPage } from './gestao-prof.page';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

describe('GestaoProfPage', () => {
  let component: GestaoProfPage;
  let fixture: ComponentFixture<GestaoProfPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestaoProfPage],
      imports: [IonicModule.forRoot(), CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GestaoProfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar a página', () => {
    expect(component).toBeTruthy();
  });

  it('deve alternar status de ativo/inativo', () => {
    const prof = { nome: 'Teste', email: 'teste@if.edu.br', ativo: true };
    component.ativarDesativar(prof);
    expect(prof.ativo).toBeFalse();
    component.ativarDesativar(prof);
    expect(prof.ativo).toBeTrue();
  });

  it('deve chamar o método de edição', () => {
    const spy = spyOn(console, 'log');
    const prof = { nome: 'Teste', email: 'teste@if.edu.br', ativo: true };
    component.editarProfessor(prof);
    expect(spy).toHaveBeenCalledWith('Editar:', prof);
  });
});
