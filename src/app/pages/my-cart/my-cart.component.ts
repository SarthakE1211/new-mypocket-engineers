import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss']
})
export class MyCartComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    document.body.classList.add('page-mobile-subpage');
  }
  ngOnDestroy(): void {
    document.body.classList.remove('page-mobile-subpage');
  }
}
