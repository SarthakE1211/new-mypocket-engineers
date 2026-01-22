import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LoaderService } from 'src/app/Service/loader.service';
import { ModalService } from 'src/app/Service/modal.service';
import * as bootstrap from 'bootstrap';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
@Component({
  selector: 'app-show-tickets',
  templateUrl: './show-tickets.component.html',
  styleUrls: ['./show-tickets.component.scss']
})
export class ShowTicketsComponent {
  ticketData: any = []
  isLoading: boolean = false
  @Input() drawerClose!: Function;
  @Input() isDrawerVisible: boolean = false;
  close() {
    this.drawerClose();
  }
  constructor(
    private cookie: CookieService,
    private modalservice: ModalService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private router: Router,
    private message: ToastrService,
    private apiservice: ApiServiceService,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) { }
  ngOnInit(): void {
    this.fetchTicketData();
    this.userID = this.apiservice.getUserId();
    this.userNAME = this.apiservice.getUserName();
    this.userAddress = this.apiservice.getUserAddress();
    this.userMobile = this.apiservice.getUsermobileNumber();
    this.userEMAIL = this.apiservice.getEmail();
  }
  userID: any = this.apiservice.getUserId();
  userNAME: any = this.apiservice.getUserName();
  userAddress: any = this.apiservice.getUserAddress();
  userMobile: any = this.apiservice.getUsermobileNumber();
  userEMAIL: any = this.apiservice.getEmail();
  statusCondition: any
  totalRecords = 1;
  fetchTicketData() {
    const statusCondition = this.selectedFilterValue ? " AND STATUS = '" + this.selectedFilterValue + "'" : "";
    this.isLoading = true
    this.apiservice
      .getAllTickets(
        this.pageIndex,
        this.pageSize,
        '',
        '',
        " AND USER_ID='" + this.userID + "'" + statusCondition + " AND ORDER_ID IS NULL AND SHOP_ORDER_ID IS NULL"
      )
      .subscribe({
        next: (data: any) => {
          this.ticketData = data.body.data;
          this.totalRecords = data.body.count
          this.filteredTickets = this.ticketData
          this.isLoading = false; 
        },
        error: (error: any) => {
          this.ticketData = []; 
          this.isLoading = false; 
        },
      });
  }
  pageIndex = 1
  pageSize = 6
  sortKey: string = "id";
  sortValue: string = "desc";
  loadMore(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = "id";
      this.sortValue = "desc";
    }
    if (this.filteredTickets.length < this.totalRecords) {
      this.isLoading = true;
      this.pageSize += 5; 
      let queryCondition = ` AND USER_ID='${this.userID}'`;
      if (this.statusCondition) {
        queryCondition += this.statusCondition;
      }
      this.apiservice
        .getAllTickets(
          1,
          this.pageSize,
          '',
          '',
          queryCondition + " AND ORDER_ID IS NULL AND SHOP_ORDER_ID IS NULL"
        )
        .subscribe({
          next: (data: any) => {
            this.ticketData = data.body.data;
            this.filteredTickets = [...this.ticketData];
            this.totalRecords = data.body.count;
            this.isLoading = false;
          },
          error: (error: any) => {
            this.isLoading = false;
          },
        });
    }
  }
  @HostListener('window:scroll', [])
  onScroll() {
    const activityItem = document.getElementById("activityItem");
    if (activityItem) {
      const scrollTop = activityItem.scrollTop;
      const offsetHeight = activityItem.offsetHeight;
      const scrollHeight = activityItem.scrollHeight;
      if (scrollTop + offsetHeight + 1 >= scrollHeight && !this.emitted) {
        this.emitted = true;
        this.onScrollingFinished();
      } else if (scrollTop + offsetHeight + 1 < scrollHeight) {
        this.emitted = false;
      }
    }
  }
  filteredTickets: any = [];
  searchTerm: string = '';
  selectedFilter: string = '';
  filterOptions = [
    { label: "All", value: "" },
    { label: "Pending", value: "P" },
    { label: "Assigned", value: "S" },
    { label: "Resolved", value: "R" },
    { label: "Closed", value: "C" },
  ];
  keyup2() {
    if (this.searchTerm.trim().length >= 3 || this.searchTerm.length === 0) {
      this.filterTickets();
    }
  }
  onEnterKey1(event: Event) {
    document.getElementById('search')?.focus();
  }
  filterTickets(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTickets = [...this.ticketData];
    }
    else {
      this.filteredTickets = this.ticketData.filter((ticket: any) =>
        ticket.TICKET_NO.includes(this.searchTerm) ||
        ticket.QUESTION.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ticket.SUBJECT.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.totalRecords = this.filteredTickets.length;
  }
  emitted = false;
  onScrollingFinished() {
    this.loadMoreP();
  }
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  loadMoreP(): void {
    if (this.getNextItems()) {
      this.categoriesSubject.next(this.filteredTickets);
    }
  }
  getNextItems(): boolean {
    if (this.filteredTickets?.length >= this.totalRecords) {
      return false;
    }
    this.pageIndex = this.pageIndex + 1;
    this.loadMore(false);
    return true;
  }
  selectedFilter1: any
  selectedFilterValue: string = ""; 
  applyFilter(label: string, status: string): void {
    this.selectedFilter = label;
    this.selectedFilterValue = status;
    this.statusCondition = this.selectedFilterValue
      ? " AND STATUS = '" + this.selectedFilterValue + "'"
      : "";
    this.isDropdownOpen = false;
    this.isLoading = true
    this.apiservice
      .getAllTickets(
        0,
        0,
        '',
        '',
        " AND USER_ID='" + this.userID + "'" + this.statusCondition + " AND ORDER_ID IS NULL AND SHOP_ORDER_ID IS NULL"
      )
      .subscribe({
        next: (data: any) => {
          this.ticketData = data.body.data;
          this.filteredTickets = this.ticketData
          this.isLoading = false; 
        },
        error: (error: any) => {
          this.ticketData = []; 
          this.isLoading = false; 
        },
      });
  }
  formatDate(date: string): string {
    return moment(date).isSame(moment(), 'day')
      ? moment(date).fromNow()
      : moment(date).format('DD MMM YYYY hh:mm A');
  }
  formatTimeAgo(date: string): string {
    return moment(date).fromNow();
  }
  gotoProfile(): void {
  }
  createTickitVisible: boolean = false
  openDrawer: any
  createTickets() {
    this.createTickitVisible = true;
    setTimeout(() => {
      const serviceDrawer = document.getElementById('showtickets');
      if (serviceDrawer) {
        let offcanvasInstance = bootstrap.Offcanvas.getInstance(serviceDrawer);
        if (!offcanvasInstance) {
          offcanvasInstance = new bootstrap.Offcanvas(serviceDrawer);
        }
        offcanvasInstance.show();
      }
    }, 100);
  }
  drawerClose1() {
    this.createTickitVisible = false;
    this.fetchTicketData();
    setTimeout(() => {
      const serviceDrawer = document.getElementById('showtickets');
      if (serviceDrawer) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(serviceDrawer);
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
    return this.drawerClose1.bind(this);
  }
  chatVisible: boolean = false
  drawerData: any = [];
  openChat(data: any) {
    setTimeout(() => {
      const chatDrawer = document.getElementById('offcanvasChat');
      if (chatDrawer) {
        const offcanvasInstance = new bootstrap.Offcanvas(chatDrawer);
        offcanvasInstance.show();
      }
      this.drawerData = data;
      this.chatVisible = true;
    }, 100);
  }
  chatdrawerClose() {
    this.chatVisible = false;
    setTimeout(() => {
      const chatDrawer = document.getElementById('offcanvasChat');
      if (chatDrawer) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(chatDrawer);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
        const backdrop = document.querySelector('.offcanvas-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    }, 300);
  }
  get chatCallback() {
    return this.chatdrawerClose.bind(this);
  }
  ngAfterViewInit() {
    var dropdownElementList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
    dropdownElementList.map(function (dropdownEl) {
      return new bootstrap.Dropdown(dropdownEl);
    });
  }
  isDropdownOpen = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}