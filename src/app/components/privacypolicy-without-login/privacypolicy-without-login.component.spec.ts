import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacypolicyWithoutLoginComponent } from './privacypolicy-without-login.component';

describe('PrivacypolicyWithoutLoginComponent', () => {
  let component: PrivacypolicyWithoutLoginComponent;
  let fixture: ComponentFixture<PrivacypolicyWithoutLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacypolicyWithoutLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacypolicyWithoutLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
