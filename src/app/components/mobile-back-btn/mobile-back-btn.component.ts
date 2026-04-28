import { Component, HostListener, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationHistoryService } from 'src/app/core/navigation-history.service';

// Mobile-only back button. Drop into any page header bar:
//   <app-mobile-back-btn fallback="/shop"></app-mobile-back-btn>
// Hidden on tablets/desktop (>=768px).
@Component({
  selector: 'app-mobile-back-btn',
  templateUrl: './mobile-back-btn.component.html',
  styleUrls: ['./mobile-back-btn.component.scss'],
})
export class MobileBackBtnComponent {
  // Where to send the user when there's no in-app history (e.g. they
  // landed on a deep link). Set per-page to the natural parent route.
  @Input() fallback: string = '/';
  @Input() ariaLabel: string = 'Back';

  isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  constructor(
    private router: Router,
    private location: Location,
    private navHistory: NavigationHistoryService
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  }

  onBack(): void {
    if (this.navHistory.hasInternalHistory()) {
      this.location.back();
    } else {
      this.router.navigateByUrl(this.fallback);
    }
  }
}
