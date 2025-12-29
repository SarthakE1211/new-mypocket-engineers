import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionWithoutLoginComponent } from './terms-and-condition-without-login.component';

describe('TermsAndConditionWithoutLoginComponent', () => {
  let component: TermsAndConditionWithoutLoginComponent;
  let fixture: ComponentFixture<TermsAndConditionWithoutLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionWithoutLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionWithoutLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
