import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoporderDetailsComponent } from './shoporder-details.component';

describe('ShoporderDetailsComponent', () => {
  let component: ShoporderDetailsComponent;
  let fixture: ComponentFixture<ShoporderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoporderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoporderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
