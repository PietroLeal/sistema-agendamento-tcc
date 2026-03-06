import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroTipoSalaPage } from './cadastro-tipo-sala.page';

describe('CadastroTipoSalaPage', () => {
  let component: CadastroTipoSalaPage;
  let fixture: ComponentFixture<CadastroTipoSalaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroTipoSalaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
