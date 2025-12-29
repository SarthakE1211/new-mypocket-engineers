import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonmapComponent } from './commonmap.component';

describe('CommonmapComponent', () => {
  let component: CommonmapComponent;
  let fixture: ComponentFixture<CommonmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonmapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
