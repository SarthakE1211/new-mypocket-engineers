import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTicketChatComponent } from './order-ticket-chat.component';

describe('OrderTicketChatComponent', () => {
  let component: OrderTicketChatComponent;
  let fixture: ComponentFixture<OrderTicketChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderTicketChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderTicketChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
