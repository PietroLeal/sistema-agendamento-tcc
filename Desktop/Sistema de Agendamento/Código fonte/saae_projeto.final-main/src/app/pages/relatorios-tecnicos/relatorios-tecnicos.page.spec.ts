import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'; 
import { RelatoriosTecnicosPage } from './relatorios-tecnicos.page';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

describe('RelatoriosTecnicosPage', () => {
  let component: RelatoriosTecnicosPage;
  let fixture: ComponentFixture<RelatoriosTecnicosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      declarations: [RelatoriosTecnicosPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatoriosTecnicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the RelatoriosTecnicosPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default form values', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('tipoLog')?.value).toBe('todos');
    expect(form.get('dataInicio')?.value).toBe('');
    expect(form.get('dataFim')?.value).toBe('');
    expect(form.get('usuario')?.value).toBe('');
  });

  it('should disable generate button when loading', () => {
    component.carregando = true;
    fixture.detectChanges();

    // Seleciona botão submit (ion-button com type="submit")
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('ion-button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });

  it('should generate report and populate relatorios array', fakeAsync(() => {
    component.gerarRelatorio();

    // Avança 1600ms para simular setTimeout
    tick(1600);
    fixture.detectChanges();

    expect(component.relatorios.length).toBeGreaterThan(0);
    expect(component.carregando).toBeFalse();
  }));

  it('should reset filters and clear relatorios', () => {
    // Ajuste aqui removendo o 'id' para evitar erro
    component.relatorios = [{ usuario: 'teste', acao: 'ação', data: 'data' }];
    component.limparFiltros();

    expect(component.form.get('tipoLog')?.value).toBe('todos');
    expect(component.relatorios.length).toBe(0);
  });
});
