import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroSalaPage } from './cadastro-sala.page';

describe('CadastroSalaPage', () => {
  let component: CadastroSalaPage;
  let fixture: ComponentFixture<CadastroSalaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroSalaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
