import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuthAvancadaComponent } from './auth-avancada.component';

describe('AuthAvancadaComponent', () => {
  let component: AuthAvancadaComponent;
  let fixture: ComponentFixture<AuthAvancadaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AuthAvancadaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthAvancadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
