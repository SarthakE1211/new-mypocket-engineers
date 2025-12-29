import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderManageTicketsComponent } from './order-manage-tickets.component';

describe('OrderManageTicketsComponent', () => {
  let component: OrderManageTicketsComponent;
  let fixture: ComponentFixture<OrderManageTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderManageTicketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderManageTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
