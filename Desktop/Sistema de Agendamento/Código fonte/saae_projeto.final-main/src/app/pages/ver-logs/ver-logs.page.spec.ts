import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerLogsPage } from './ver-logs.page';

describe('VerLogsPage', () => {
  let component: VerLogsPage;
  let fixture: ComponentFixture<VerLogsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), VerLogsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(VerLogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
