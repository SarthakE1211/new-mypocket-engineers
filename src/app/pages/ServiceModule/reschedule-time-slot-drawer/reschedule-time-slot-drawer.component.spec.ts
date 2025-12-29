import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleTimeSlotDrawerComponent } from './reschedule-time-slot-drawer.component';

describe('RescheduleTimeSlotDrawerComponent', () => {
  let component: RescheduleTimeSlotDrawerComponent;
  let fixture: ComponentFixture<RescheduleTimeSlotDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RescheduleTimeSlotDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescheduleTimeSlotDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
