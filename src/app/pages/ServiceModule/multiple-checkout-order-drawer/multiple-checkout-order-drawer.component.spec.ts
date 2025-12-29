import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleCheckoutOrderDrawerComponent } from './multiple-checkout-order-drawer.component';

describe('MultipleCheckoutOrderDrawerComponent', () => {
  let component: MultipleCheckoutOrderDrawerComponent;
  let fixture: ComponentFixture<MultipleCheckoutOrderDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleCheckoutOrderDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleCheckoutOrderDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
