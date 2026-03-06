import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissoesPage } from './permissoes.page';

describe('PermissoesPage', () => {
  let component: PermissoesPage;
  let fixture: ComponentFixture<PermissoesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
