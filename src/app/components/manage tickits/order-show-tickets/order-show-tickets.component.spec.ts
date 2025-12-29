import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderShowTicketsComponent } from './order-show-tickets.component';

describe('OrderShowTicketsComponent', () => {
  let component: OrderShowTicketsComponent;
  let fixture: ComponentFixture<OrderShowTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderShowTicketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderShowTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
