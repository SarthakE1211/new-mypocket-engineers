import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    document.body.classList.add('page-mobile-subpage');
  }
  ngOnDestroy(): void {
    document.body.classList.remove('page-mobile-subpage');
  }
}
