import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooteraboutpageComponent } from './footeraboutpage.component';

describe('FooteraboutpageComponent', () => {
  let component: FooteraboutpageComponent;
  let fixture: ComponentFixture<FooteraboutpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooteraboutpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooteraboutpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
