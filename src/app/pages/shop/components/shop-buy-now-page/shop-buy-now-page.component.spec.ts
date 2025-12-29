import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopBuyNowPageComponent } from './shop-buy-now-page.component';

describe('ShopBuyNowPageComponent', () => {
  let component: ShopBuyNowPageComponent;
  let fixture: ComponentFixture<ShopBuyNowPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopBuyNowPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopBuyNowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
