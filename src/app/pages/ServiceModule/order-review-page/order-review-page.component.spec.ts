import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReviewPageComponent } from './order-review-page.component';

describe('OrderReviewPageComponent', () => {
  let component: OrderReviewPageComponent;
  let fixture: ComponentFixture<OrderReviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderReviewPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderReviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
