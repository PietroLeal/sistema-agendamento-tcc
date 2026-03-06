import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControleAcessoPage } from './controle-acesso.page';

describe('ControleAcessoPage', () => {
  let component: ControleAcessoPage;
  let fixture: ComponentFixture<ControleAcessoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ControleAcessoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
