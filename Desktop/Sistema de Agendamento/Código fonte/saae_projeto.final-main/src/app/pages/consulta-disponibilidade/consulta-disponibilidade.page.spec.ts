import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaDisponibilidadePage } from './consulta-disponibilidade.page';

describe('ConsultaDisponibilidadePage', () => {
  let component: ConsultaDisponibilidadePage;
  let fixture: ComponentFixture<ConsultaDisponibilidadePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaDisponibilidadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
