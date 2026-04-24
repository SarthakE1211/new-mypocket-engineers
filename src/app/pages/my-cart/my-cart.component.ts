import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/Service/loader.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss']
})
export class MyCartComponent implements OnInit, OnDestroy {
  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    document.body.classList.add('page-mobile-subpage');
    // AppComponent raises the loader on every boot as "initial loading bit"
    // but nothing on /my-cart would ever hide it — leaving the Pockit pulse
    // overlay stuck after the splash failsafe. Lower it now that the cart
    // view is on screen.
    this.loaderService.hideLoader();
  }
  ngOnDestroy(): void {
    document.body.classList.remove('page-mobile-subpage');
  }
}
