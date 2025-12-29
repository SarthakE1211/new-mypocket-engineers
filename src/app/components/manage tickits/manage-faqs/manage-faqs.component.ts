import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as bootstrap from 'bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LoaderService } from 'src/app/Service/loader.service';
import { ModalService } from 'src/app/Service/modal.service';

@Component({
  selector: 'app-manage-faqs',
  templateUrl: './manage-faqs.component.html',
  styleUrls: ['./manage-faqs.component.scss'],
})
export class ManageFaqsComponent {
  @Input() drawerClose!: Function;
  @Input() isFAQDrawerVisible: boolean = false;
  // @Input() data: any;
  close() {
    this.drawerClose();
    this.getfaqhead();
  }
  userID: any = this.apiservice.getUserId();
  userNAME: any = this.apiservice.getUserName();
  userAddress: any = this.apiservice.getUserAddress();
  userMobile: any = this.apiservice.getUsermobileNumber();
  currentterritory:any=sessionStorage.getItem('CurrentTerritory')

  userEMAIL: any = this.apiservice.getEmail();
  constructor(
    private route: ActivatedRoute,
    private cookie: CookieService,
    private modalservice: ModalService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private router: Router,
    private message: ToastrService,
    private apiservice: ApiServiceService,
    private toastr: ToastrService,
    private loaderService: LoaderService // private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userID = this.apiservice.getUserId();
    this.userNAME = this.apiservice.getUserName();
    this.userAddress = this.apiservice.getUserAddress();
    this.userMobile = this.apiservice.getUsermobileNumber();
    this.userEMAIL = this.apiservice.getEmail();
    this.getfaqhead();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isFAQDrawerVisible'] &&
      changes['isFAQDrawerVisible'].currentValue
    ) {
    }
  }

  manageTickets() {
    this.showDrawer();
  }
  isDrawerVisible = false;

  showDrawer() {
    this.isDrawerVisible = true;

    setTimeout(() => {
      const chatDrawer = document.getElementById('offcanvasRight11');
      if (chatDrawer) {
        let offcanvasInstance = bootstrap.Offcanvas.getInstance(chatDrawer);
        if (!offcanvasInstance) {
          offcanvasInstance = new bootstrap.Offcanvas(chatDrawer);
        }
        offcanvasInstance.show();
      }
    }, 100);
  }

  TikitdrawerClose() {
    this.isDrawerVisible = false;

    setTimeout(() => {
      const chatDrawer = document.getElementById('offcanvasRight11');
      if (chatDrawer) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(chatDrawer);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }
      const backdrop = document.querySelector('.offcanvas-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }, 300);
  }

  get closeCallback() {
    return this.TikitdrawerClose.bind(this);
  }
  gotoProfile() {
    // this.showContent = 'normal';
    // this.getuserList();
  }

  faqData: any = [];
  faqLoading: boolean = false;
  getfaqData(headid: any) {
    this.faqLoading = true;
    if (headid) {
      this.apiservice
        .getfaqData(
          0,
          0,
          'SEQ_NO', 'asc',
          " AND STATUS =1 AND FAQ_TYPE ='C' AND FAQ_HEAD_ID='" + headid + "'"
        )
        .subscribe({
          next: (data: any) => {
            if (data.data.length > 0) {
              this.faqData = data.data;

              this.faqLoading = false; // Hide loading state
            } else {
              this.faqData = [];
              this.faqLoading = false; // Hide loading state
            }
          },
          error: (error: any) => {
            this.faqData = []; // Clear data on error
            this.faqLoading = false; // Hide loading state
          },
        });
    }
  }
  activePanelIndex: number | null = null;
  activePanelIndex11111: number | null = null;
  togglePanel(index: number): void {
    this.activePanelIndex = this.activePanelIndex === index ? null : index;
  }
  togglePanel111111(index: number, headid: any): void {

    this.faqData = [];
    this.activePanelIndex = null;
    this.activePanelIndex11111 =
      this.activePanelIndex11111 === index ? null : index;
    if (
      this.activePanelIndex11111 !== null &&
      this.activePanelIndex11111 !== undefined
    ) {
      this.getfaqData(headid);
      this.faqData = [];
    }
  }
  faqDatahead: any = [];
  faqheadLoading: boolean = false;

  getfaqhead() {
    this.faqheadLoading = true;
    this.apiservice
      .getfaqDatahead(0, 0, 'SEQUENCE_NO', 'asc', " AND STATUS =1 AND FAQ_HEAD_TYPE ='C'")
      .subscribe({
        next: (data: any) => {
          if (data.data.length > 0) {
            this.faqDatahead = data.data;

            this.faqheadLoading = false; // Hide loading state
          } else {
            this.faqDatahead = [];
            this.faqheadLoading = false; // Hide loading state
          }
        },
        error: (error: any) => {
          this.faqDatahead = [];
          this.faqheadLoading = false; // Hide loading state
        },
      });
  }
}
