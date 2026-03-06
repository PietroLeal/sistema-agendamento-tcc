import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadastroReservaPage } from './cadastro-reserva.page';

describe('CadastroReservaPage', () => {
  let component: CadastroReservaPage;
  let fixture: ComponentFixture<CadastroReservaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroReservaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroReservaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
