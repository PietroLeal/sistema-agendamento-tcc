import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaSalasPage } from './consulta-salas.page';

describe('ConsultaSalasPage', () => {
  let component: ConsultaSalasPage;
  let fixture: ComponentFixture<ConsultaSalasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaSalasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
