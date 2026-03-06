import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizacaoDetalhadaPage } from './visualizacao-detalhada.page';

describe('VisualizacaoDetalhadaPage', () => {
  let component: VisualizacaoDetalhadaPage;
  let fixture: ComponentFixture<VisualizacaoDetalhadaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualizacaoDetalhadaPage],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizacaoDetalhadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar a página', () => {
    expect(component).toBeTruthy();
  });
});
