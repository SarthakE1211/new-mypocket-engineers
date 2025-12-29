import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSubcategoryDrawerComponent } from './shared-subcategory-drawer.component';

describe('SharedSubcategoryDrawerComponent', () => {
  let component: SharedSubcategoryDrawerComponent;
  let fixture: ComponentFixture<SharedSubcategoryDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSubcategoryDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedSubcategoryDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
