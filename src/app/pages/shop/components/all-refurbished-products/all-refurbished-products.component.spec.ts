import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRefurbishedProductsComponent } from './all-refurbished-products.component';

describe('AllRefurbishedProductsComponent', () => {
  let component: AllRefurbishedProductsComponent;
  let fixture: ComponentFixture<AllRefurbishedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRefurbishedProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllRefurbishedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
