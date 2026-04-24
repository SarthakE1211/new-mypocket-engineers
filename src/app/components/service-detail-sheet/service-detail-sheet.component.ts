import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Mobile-only bottom-sheet replacement for the ServiceComponent's service
// detail modal. Slides up from the bottom of the viewport, covers the bottom
// ~90% of the screen, and exposes every field from the mockups: title,
// subtitle, rating, reviews link, service description with breadcrumb and
// "What We Do" steps, Pockit Warranty accordion, "How Pockit Works" 4-step
// diagram, base price + duration, quantity stepper, "Not Included" section,
// and a sticky Confirm button.
//
// Content that does not exist on the service API today (Warranty copy,
// Not Included bullets, What We Do steps, How Pockit Works diagram) is
// hardcoded as defaults below — swap for API-sourced content later without
// restructuring the template.
@Component({
  selector: 'app-service-detail-sheet',
  templateUrl: './service-detail-sheet.component.html',
  styleUrls: ['./service-detail-sheet.component.scss'],
})
export class ServiceDetailSheetComponent implements OnChanges, OnDestroy {
  @Input() visible: boolean = false;
  @Input() service: any = null;
  @Input() imageUrl: string = '';
  @Input() customerType: string = '';
  @Input() categoryName: string = '';
  @Input() subCategoryName: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<any>();
  @Output() viewReviews = new EventEmitter<any>();

  quantity: number = 1;
  descriptionOpen: boolean = false;
  warrantyOpen: boolean = false;
  warrantySubExpanded: 'how' | 'calc' | 'notCovered' | null = null;
  howLearnMoreOpen: boolean = false;
  sanitizedDescription: SafeHtml | null = null;

  // Hardcoded defaults for content not yet on the service API. Replace these
  // by wiring to real API fields when the backend ships them.
  readonly howPockitWorks = [
    { image: 'assets/img/how-pockit-works/book-confirm.png', label: 'Book & Confirm' },
    { image: 'assets/img/how-pockit-works/technician-connects.png', label: 'Technician Connects' },
    { image: 'assets/img/how-pockit-works/diagnose-resolve.png', label: 'Diagnose & Resolve' },
    { image: 'assets/img/how-pockit-works/secure-payment.png', label: 'Secure Payment' },
  ];

  // Expanded detail shown when the user taps "Learn more ›" under the
  // How Pockit Works summary. Same placeholder-content approach as elsewhere
  // in this component: hardcoded defaults driven from the mockups, to be
  // swapped for API-sourced content once the backend exposes these fields.
  readonly howLearnMoreSteps = [
    { title: 'Book & Confirm', body: 'Schedule online; receive instant booking confirmation.' },
    { title: 'Technician Visits or Remote Call for Instant Help', body: 'For onsite services a Pockit Engineer arrives at your doorstep.\n\nFor instant help a Pockit expert calls you, walks you through diagnosis, and recommends a fix.' },
    { title: 'Diagnosis & Quote', body: 'A transparent repair quote is shared before any work begins.' },
    { title: 'Spare Parts (if required)', body: 'Sourced at Pockit fixed rates with your prior approval.' },
    { title: 'Repair / Service', body: 'Work completed on-site; hard disk handed over to you for data safety.' },
    { title: 'Post-Service Clean-Up', body: 'Technician leaves your workspace neat and tidy.' },
    { title: 'Payment', body: 'Pay the balance after adjusting the booking fee already paid.' },
  ];

  readonly expertVerified = {
    title: 'Expert Verified Repair Quotes',
    items: [
      'Pockit verify the repair quote shared by the professional.',
      'If unsure, you can ask our expert for a second opinion.',
    ],
  };

  readonly fixedRateCard = {
    title: 'Fixed rate card',
    items: [
      'All our prices are decided based on market standards.',
      'If you are charged differently from the rate card, reach out to our help centre.',
    ],
    notIncluded: [
      'For motherboard issues, the laptop will be taken to the repair shop.',
      'The repair quote will be provided after the check-up.',
      'Visitation charges will be adjusted in the final quote.',
    ],
  };

  readonly whatWeDo = [
    'Secure remote connection to your device within minutes',
    'Real-time diagnosis of software issues, errors, and performance problems',
    'Instant troubleshooting and resolution for common tech problems',
    'Expert guidance on system optimization and preventive measures',
    'Detailed report of findings and recommendations',
  ];

  readonly notIncluded = [
    'Physical or liquid damage requiring on-site inspection',
    'Hardware component failures identified during scan',
    'Issues beyond the scope of remote diagnosis',
    'Data recovery or backup services',
    'Software licence or subscription costs',
  ];

  readonly warrantyHighlights = [
    'Upto 30 Days of warranty on service and spare parts.',
    'Free re-repairs if the same issue recurs within the warranty period.',
  ];

  readonly warrantyCopy = {
    how: [
      '100% warranty coverage — labour & spare parts included.',
      'Expert-verified repair quotes before work begins.',
      'Fixed rate card — no surprise charges.',
      'One-click hassle-free warranty claims.',
      'No paperwork or follow-up required.',
    ],
    calc: [
      '5 days warranty on servicing and minor repairs not requiring spare parts.',
    ],
    notCovered: [
      'Any new issues occurring post repair in parts not repaired by Pockit.',
      'Spare parts not purchased from Pockit.',
    ],
  };

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['service'] && this.service) {
      this.quantity = 1;
      this.descriptionOpen = false;
      this.warrantyOpen = false;
      this.warrantySubExpanded = null;
      this.howLearnMoreOpen = false;
      const desc = this.service?.DESCRIPTION;
      this.sanitizedDescription = desc ? this.sanitizer.bypassSecurityTrustHtml(desc) : null;
    }
    if (changes['visible']) {
      if (this.visible) {
        // Reset accordion state each time the sheet opens so the user sees the
        // primary summary first, not whatever they expanded last time.
        this.descriptionOpen = false;
        this.warrantyOpen = false;
        this.warrantySubExpanded = null;
        this.howLearnMoreOpen = false;
      }
      // FooterComponent hides the mobile bottom nav whenever `body.drawer-open`
      // is set. This sheet is a custom element (not a Bootstrap offcanvas/modal)
      // so none of the footer's default detection signals fire — toggling the
      // class here opts us into the same behaviour and keeps the sticky
      // Confirm button from being covered by the Home / Order / Cart bar.
      document.body.classList.toggle('drawer-open', this.visible);
    }
  }

  ngOnDestroy(): void {
    // Defensive cleanup: if the sheet is destroyed while open (route change,
    // parent *ngIf flips, etc.) leaving the body class set would permanently
    // hide the bottom nav on the next page.
    document.body.classList.remove('drawer-open');
  }

  get durationMinutes(): number {
    if (!this.service) return 0;
    return (this.service.DURARTION_HOUR || 0) * 60 + (this.service.DURARTION_MIN || 0);
  }

  get basePrice(): number {
    return this.service?.B2C_PRICE || 0;
  }

  get rating(): number {
    return Number(this.service?.AVG_RATINGS) || 0;
  }

  // Display rating shown in the sheet header. Until organic reviews accrue we
  // show a stable pseudo-random value in the 4.5–5.0 range seeded off the
  // service ID — same service always renders the same rating, different
  // services look varied. Falls back to the real AVG_RATINGS once non-zero.
  get displayRating(): number {
    const actual = Number(this.service?.AVG_RATINGS);
    if (Number.isFinite(actual) && actual > 0) return Math.round(actual * 10) / 10;
    const seed = this.stableSeed(this.service?.ID);
    const step = seed % 6; // 0..5 → 4.5, 4.6, 4.7, 4.8, 4.9, 5.0
    return Math.round((4.5 + step / 10) * 10) / 10;
  }

  // Paired with displayRating: if the backend ever reports a real review
  // count we use it, otherwise a stable pseudo-random 49–159 seeded off the
  // same service ID so rating and count feel coherent.
  get reviewCount(): number {
    const actual = Number(this.service?.REVIEW_COUNT ?? this.service?.TOTAL_REVIEWS);
    if (Number.isFinite(actual) && actual > 0) return actual;
    const seed = this.stableSeed(this.service?.ID);
    return 49 + (seed % (159 - 49 + 1));
  }

  private stableSeed(id: any): number {
    const str = String(id ?? 'pockit');
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  get maxQty(): number {
    return this.service?.MAX_QTY || 1;
  }

  increaseQty(): void {
    if (this.quantity < this.maxQty) this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  toggleDescription(): void {
    this.descriptionOpen = !this.descriptionOpen;
  }

  toggleLearnMore(): void {
    this.howLearnMoreOpen = !this.howLearnMoreOpen;
  }

  toggleWarranty(): void {
    this.warrantyOpen = !this.warrantyOpen;
    if (!this.warrantyOpen) this.warrantySubExpanded = null;
  }

  toggleWarrantySub(key: 'how' | 'calc' | 'notCovered'): void {
    this.warrantySubExpanded = this.warrantySubExpanded === key ? null : key;
  }

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    if (!this.service) return;
    this.confirm.emit({ service: this.service, quantity: this.quantity });
  }

  onViewReviews(event: Event): void {
    event.stopPropagation();
    this.viewReviews.emit(this.service);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.onClose();
  }
}
