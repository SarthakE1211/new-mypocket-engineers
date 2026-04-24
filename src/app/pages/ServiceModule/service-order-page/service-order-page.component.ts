import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import * as _moment from 'moment';
const moment = _moment as any;
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { LocationService } from 'src/app/Service/location.service';
import { OrdersOverlayService } from 'src/app/Service/orders-overlay.service';

declare var google: any;
declare var Razorpay: any;
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-service-order-page',
  templateUrl: './service-order-page.component.html',
  styleUrls: ['./service-order-page.component.scss'],
})
export class ServiceOrderPageComponent {
  PopularServices: any[] = [];
  profileData = [];
  type = 'service';
  orderDetails: any = {
    serviceType: 'Repair',
    serviceLevel: 'Premium',
    orderId: 'ORD12345',
    date: '2025-02-27',
    timeSlot: '10:00 AM - 12:00 PM',
    timeSlotUnavailable: true,
    estimatedTime: 60,
    device: 'Laptop',
    type: 'Screen Replacement',
    qty: 1,
    contact: {
      name: 'John Doe',
      phone: '9876543210',
      email: 'john.doe@example.com',
    },
    reschedulePolicy: 'You can reschedule your order within 24 hours.',
    cancellationPolicy: 'Cancellation is allowed within 12 hours of order.',
    orderStatus: 'Confirmation required',
    statusHistory: [
      {
        title: 'Order accepted',
        date: '7 Jan 9:00 AM',
        completed: true,
      },
      {
        title: 'Confirmation required',
        date: '17 Dec 8:00 PM',
        description:
          "We need your confirmation on the required part to proceed. We'll contact you by tomorrow during working hours to follow up.",
        completed: false,
      },
      {
        title: 'Technician assigned',
        date: '',
        completed: false,
      },
      {
        title: 'Order completed',
        date: '',
        completed: false,
      },
    ],
    paymentAmount: 999.99,
  };
  addresses: any = [];
  defaultAddress: any = [];
  servicesList: any = [];
  mapUrl: any;
  @ViewChild('mapContainer', { static: false }) mapElement!: ElementRef;
  map!: any;
  customertype: any = this.apiservice.getCustomerType();
  polyline!: any;
  technicianMarker!: any;
  customerMarker!: any;
  technicianCoords: any = { latitude: 0, longitude: 0 };
  customerCoords: any = { latitude: 0, longitude: 0 };
  loadepage: boolean = false;
  retriveimgUrl = this.apiservice.retriveimgUrl;
  constructor(
    private route: ActivatedRoute,
    private apiservice: ApiServiceService,
    private message: ToastrService,
    private locationService: LocationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone,
    private router: Router,
    private ordersOverlay: OrdersOverlayService,
    private ngLocation: Location
  ) { }
  userID: any = this.apiservice.getUserId();
  userName: any = this.apiservice.getUserName();
  userMobileNo: any = this.apiservice.getUsermobileNumber();
  currentterritory: any;
  orderData: any = [];
  orderDataLogs: any[] = [];
  orderGetDetails: any[] = [];
  orderID: any;
  jobCardId!: any;
  currentCoords: { latitude: number; longitude: number } = {
    latitude: 0,
    longitude: 0,
  };
  data1 = this.apiservice.getCustomerType();
  IMAGEuRL: any;
  maxCharLength: number = 16;
  maxCharData: number = 30;
  hasTechnicianData = false
  ngOnInit() {
    if (sessionStorage.getItem('TECHNICIAN_DATA')) {
      this.hasTechnicianData = true
    }
    this.setMaxCharLengthBasedOnScreen();
    window.addEventListener('resize', () =>
      this.setMaxCharLengthBasedOnScreen()
    );
    const rawValue = sessionStorage.getItem('CurrentTerritory');
    if (rawValue && !isNaN(Number(rawValue))) {
      this.currentterritory = Number(rawValue);
    } else {
      this.currentterritory = 0;
    }
    this.orderDetailsVisible = { paymentSummary: true };
    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.orderID = serviceId;
      this.fetchPopularServices(serviceId);
      this.fetchOrderLogs(serviceId);
      this.fetchOrderDetails(serviceId);
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.style.overflowY = 'auto';
    }, 500);
    sessionStorage.setItem('chatopen', 'false');
  }
  setMaxCharLengthBasedOnScreen(): void {
    const screenWidth = window.innerWidth;
    this.maxCharLength = screenWidth < 576 ? 8 : 16;
    this.maxCharData = screenWidth < 576 ? 8 : 30;
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.setMaxCharLengthBasedOnScreen);
  }

  // Set at construction time by reading-and-clearing the session flag the
  // header drops when it navigates here from the in-header orders drawer.
  // Keeping it on a component field means the flag's lifecycle is scoped to
  // a single visit to /order-details — it can't leak into a later one where
  // the user arrived via /my-orders or a deep link.
  private reopenOrdersDrawerOnBack: boolean = (() => {
    const set = sessionStorage.getItem('pockit.reopenOrdersDrawerOnBack') === '1';
    if (set) sessionStorage.removeItem('pockit.reopenOrdersDrawerOnBack');
    return set;
  })();

  // Back button handler. If we arrived here from the bottom-nav orders
  // drawer, reopen the drawer before popping history so the user lands
  // back on the orders list (over home), not on bare home. Otherwise,
  // fall back to browser history (natural "back" UX for /my-orders, the
  // profile menu overlay, deep links, etc.).
  goBack(): void {
    if (this.reopenOrdersDrawerOnBack) {
      // HeaderComponent listens to this and pops the My Orders drawer open.
      // It's mounted on both /order-details and /service, so the drawer
      // stays up as the route changes out from under it.
      this.ordersOverlay.open();
    }
    // On mobile, window.history.back() can land on an unrelated preceding
    // SPA route like /shop/cart (if the user bounced around before opening
    // an order), which feels broken. Always route to /my-orders — the
    // natural parent for an order-details page — so the back button is
    // predictable. Desktop keeps the smoother history.back() experience.
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      this.router.navigate(['/my-orders']);
      return;
    }
    if (window.history.length > 1) {
      this.ngLocation.back();
      return;
    }
    this.router.navigate(['/my-orders']);
  }
  selectedIndex: number | null = 0;
  setSelectedCard(index: number) {
    this.selectedIndex = index;
  }
  isMapLoaded = false;
  popoverContent: string = '';
  ngAfterViewInit() {
  }
  reasonsisLoading: boolean = false;
  comment: string = '';
  cancelReasons: any;
  openDrawer(type: string) {
    if (type === 'reschedule') {
      this.rescheduleLoading = true;
      this.apiservice
        .getCancellationReason(
          0,
          0,
          'id',
          'asc',
          ` AND IS_ACTIVE = 1 AND REASON_FOR = 'S'  AND TYPE = 'OR'`
        )
        .subscribe({
          next: (response) => {
            if (response?.code === 200) {
              this.rescheduleReasons = response.data.map((item: any) => ({
                ID: item.ID,
                label: item.REASON,
                selected: false,
              }));
            }
            this.rescheduleLoading = false;
          },
          error: (err) => {
            this.rescheduleLoading = false;
          },
        });
      const rescheduleDrawer = new bootstrap.Offcanvas('#rescheduleDrawer');
      rescheduleDrawer.show();
    } else if (type === 'cancel') {
      this.reasonsisLoading = true;
      this.apiservice
        .getCancellationReason(
          0,
          0,
          'id',
          'asc',
          ` AND IS_ACTIVE = 1 AND REASON_FOR = 'S'  AND TYPE = 'CO'`
        )
        .subscribe({
          next: (response) => {
            if (response?.code === 200) {
              this.cancelReasons = response.data.map((item: any) => ({
                ID: item.ID,
                label: item.REASON,
                selected: false,
              }));
            }
            this.reasonsisLoading = false;
          },
          error: (err) => {
            this.reasonsisLoading = false;
          },
        });
      const cancelDrawer = new bootstrap.Offcanvas('#cancelDrawer');
      cancelDrawer.show();
    }
  }
  loading: boolean = false;
  openConfirmModal() {
    const confirmModal = new bootstrap.Modal('#confirmCancelModal');
    confirmModal.show();
  }
  confirmCancel() {
    const confirmModal: any = bootstrap.Modal.getInstance(
      '#confirmCancelModal'
    );
    confirmModal.hide();
    this.loading = true;
    const selectedReasons = this.cancelReasons
      .filter((r: any) => r.selected)
      .map((r: any) => r.label);
    if (selectedReasons.length === 0 && !this.comment.trim()) {
      this.message.warning(
        'Please select at least one reason or enter a comment.'
      );
      this.loading = false;
      return;
    }
    const body = {
      REQUESTED_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
      CUSTOMER_ID: this.userID,
      ORDER_ID: this.orderID,
      PAYMENT_ID: null,
      CANCELLED_BY: null,
      CANCEL_DATE: null,
      REASON: selectedReasons.join(', '),
      REMARK: '',
      CUSTOMER_REMARK: this.comment,
      REFUND_STATUS: 'P',
      CLIENT_ID: 1,
      REFUNDED_DATE: null,
      PAYMENT_REFUND_STATUS: null,
    };
    this.apiservice.addOrderCancellationTransaction(body).subscribe(
      (response: any) => {
        this.loading = false;
        if (response?.code === 200) {
          this.message.success('Order cancelled successfully!', '');
          this.cancelReasons.forEach((r: any) => (r.selected = false));
          this.comment = '';
          const cancelDrawer = bootstrap.Offcanvas.getInstance('#cancelDrawer');
          cancelDrawer?.hide();
          this.router.navigate(['/service']);
        } else {
          this.message.error(
            'Order cancellation failed. Please contact support.',
            ''
          );
        }
      },
      (error) => {
        this.loading = false;
        this.message.error('An error occurred while cancelling the order.', '');
      }
    );
  }
  rescheduleReasons: any[] = [];
  rescheduleLoading = false;
  rescheduleComment = '';
  drawerData: any = [];
  isDrawerVisible: boolean = false;
  proceedReschedule(data: any) {
    const selectedReasons = this.rescheduleReasons
      .filter((r: any) => r.selected)
      .map((r: any) => r.label);
    if (selectedReasons.length === 0 && !this.comment.trim()) {
      this.message.warning(
        'Please select at least one reason or enter a comment.'
      );
      this.loading = false;
      return;
    }
    setTimeout(() => {
      const serviceDrawer = document.getElementById('rescheduletimeslotdrawer');
      if (serviceDrawer) {
        let offcanvasInstance = bootstrap.Offcanvas.getInstance(serviceDrawer);
        if (!offcanvasInstance) {
          offcanvasInstance = new bootstrap.Offcanvas(serviceDrawer);
        }
        offcanvasInstance.show();
      }
      this.drawerData = [data[0]];
    }, 200);
  }
  drawerClose() {
    this.isDrawerVisible = false;
    setTimeout(() => {
      const serviceDrawer = document.getElementById('rescheduletimeslotdrawer');
      if (serviceDrawer) {
        const offcanvasInstance =
          bootstrap.Offcanvas.getInstance(serviceDrawer);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }
    }, 300);
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  getCombinedDateTime(job: any): string {
    if (job.SCHEDULED_DATE_TIME && job.JOB_START_TIME) {
      const datePart = job.SCHEDULED_DATE_TIME.split(' ')[0];
      const timePart = job.JOB_START_TIME;
      const combined = `${datePart}T${timePart}Z`;
      return new Date(combined).toLocaleString('en-US', { timeZone: 'UTC' });
    } else {
      return 'Not Mentioned';
    }
  }
  generatePopoverContent() {
    this.popoverContent = `
      <div class="status-container">
        <ul class="list-unstyled position-relative">
          ${this.orderDetails.statusHistory
        .map(
          (status: any, index: any, array: any) => `
            <li class="status-item d-flex align-items-start">
              <i class="${status.completed
              ? 'bi bi-check-circle-fill text-success'
              : 'bi bi-circle text-secondary'
            } status-icon me-2"></i>
              <div>
                <p class="mb-0 fw-semibold ${status.completed ? 'text-dark' : ''
            }">
                  ${status.title},
                  <span class="text-muted">${status.date}</span>
                </p>
              </div>
              ${index < array.length - 1
              ? '<div class="bg-primary-light"></div>'
              : '1'
            }
            </li>
          `
        )
        .join('')}
        </ul>
      </div>
    `;
  }
  orderid: any;
  fetchPopularServices(serviceId: string) {
    const filterCondition = `AND CUSTOMER_ID = ${this.userID} AND ID = ${serviceId}`;
    this.apiservice
      .getorderData(0, 0, 'id', 'desc', filterCondition)
      .subscribe({
        next: (data) => {
          if (data?.code === 200 && Array.isArray(data?.data)) {
            this.orderData = data?.data;
            this.orderid = this.orderData[0]['ID'];
          } else {
          }
        },
        error: (error) => { },
      });
  }
  @ViewChild('popoverButton') popoverButton!: ElementRef;
  isScheduled: boolean = false;
  fetchOrderLogs(serviceId: string) {
    const orderId = Number(serviceId);
    if (isNaN(orderId)) {
      return;
    }
    const filter: any = {
      $and: [
        { ORDER_ID: { $in: [orderId] } },
        { LOG_TYPE: { $in: ['Order'] } },
      ],
    };
    this.apiservice
      .getorderLogs(1, 10, 'DATE_TIME', 'ASC', filter, orderId, 'O')
      .subscribe({
        next: (data) => {
          if (data?.code === 200 && Array.isArray(data?.data)) {
            this.orderDetails.statusHistory = data.data.map((log: any) => ({
              title: log.ORDER_STATUS,
              date: this.datePipe.transform(
                log.DATE_TIME,
                'dd/MM/yyyy HH:mm a'
              ),
              description: log.ACTION_DETAILS,
              completed: true,
            }));
            this.isScheduled = this.orderDetails.statusHistory.some(
              (data: any) =>
                data.title.replace(/\.$/, '').trim() === 'Order scheduled'
            );
          } else {
            this.orderDetails.statusHistory = [];
          }
        },
        error: (error) => {
          this.orderDetails.statusHistory = [];
        },
      });
  }
  isLoading: boolean = false;
  latitude: any;
  longitude: any;
  showToast() {
    this.message.error('Order is rejected', '');
  }
  ordernumber = "";
  jobcardnumber = "";
  fetchOrderDetails(serviceId: string) {
    this.isLoading = true;
    this.apiservice.getOrderDetails(this.userID, serviceId).subscribe({
      next: (data) => {
        if (data?.code === 200) {
          this.orderGetDetails = data.data;
          this.ordernumber = data.data[0]['ORDER_NUMBER'];
          this.jobcardnumber = data.data[0]['JOB_CARD_NO'];
          if (this.orderGetDetails?.length > 0) {
            this.toggleCollapse(0, this.orderGetDetails[0]);
          }
          this.latitude = data.data[0]['LATITUDE'];
          this.longitude = data.data[0]['LONGITUDE'];
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }
  isOPWithin6Hours(): boolean {
    if (this.orderGetDetails.length === 0) return false;
    const order = this.orderGetDetails[0];
    return (
      order.ORDER_STATUS === 'OP' &&
      moment(order.ORDER_DATE_TIME).isBefore(moment().add(6, 'hours'))
    );
  }
  isShowMenu(): boolean {
    if (this.orderGetDetails.length === 0) return false;
    const order = this.orderGetDetails[0];
    return (
      ((order.ORDER_STATUS === 'OP' || order.ORDER_STATUS === 'OA') &&
        order.REFUND_STATUS !== 'P') ||
      (order.ORDER_STATUS === 'CO' && this.apiservice.getCustomerType() === 'I')
    );
  }
  isShowDownloadInvoice(): boolean {
    if (this.orderGetDetails.length === 0) return false;
    const order = this.orderGetDetails[0];
    return (
      order.ORDER_STATUS === 'CO' && this.apiservice.getCustomerType() === 'I'
    );
  }
  downloadProgress = {
    show: false,
    progress: 0,
    error: false,
    errorMessage: '',
  };
  setDownloadProgress(progress: {
    show: boolean;
    progress: number;
    error: boolean;
    errorMessage: string;
  }) {
    this.downloadProgress = { ...this.downloadProgress, ...progress };
  }
  isDownloading: boolean = false;
  onDownloadInvoice() {
    this.isDownloading = true;
    this.setDownloadProgress({
      show: true,
      progress: 0,
      error: false,
      errorMessage: '',
    });
    const order = this.orderGetDetails[0];
    if (!order) return;
    const filter = `AND ORDER_ID = ${order.ORDER_ID} AND CUSTOMER_ID = ${this.userID} AND TYPE = 'O'`;
    this.apiservice.getInvoice(filter).subscribe({
      next: (response: any) => {
        if (response?.code !== 200 || !response.data.length) {
          this.message.error('Invoice not found', '');
          this.isDownloading = false;
          return;
        }
        const invoiceUrl =
          this.IMAGEuRL + 'Invoices/' + response?.data[0]?.INVOICE_URL;
        this.openInvoice(invoiceUrl);
      },
      error: (err) => {
        this.handleDownloadError(err);
        this.isDownloading = false;
      },
    });
  }
  openInvoice(url: string) {
    window.open(url, '_blank');
    this.setDownloadProgress({
      show: false,
      progress: 100,
      error: false,
      errorMessage: '',
    });
    this.isDownloading = false;
  }
  handleDownloadError(error: any) {
    this.setDownloadProgress({
      show: false,
      progress: 0,
      error: true,
      errorMessage: 'Download Failed',
    });
    alert('Download Failed');
  }
  isShowDownload(): boolean {
    if (this.orderGetDetails.length === 0) return false;
    return this.orderGetDetails[0].ORDER_STATUS === 'CO';
  }
  isShowReschedule(): boolean {
    if (this.orderGetDetails.length === 0) return false;
    const order = this.orderGetDetails[0];
    return (
      order.ORDER_STATUS === 'OP' &&
      moment(order.ORDER_DATE_TIME).isBefore(moment().add(6, 'hours'))
    );
  }
  isShowCancel(): boolean {
    if (this.orderGetDetails.length === 0) return false;
    const order = this.orderGetDetails[0];
    return order.ORDER_STATUS === 'OP' || order.ORDER_STATUS === 'OA';
  }
  openIndex: number | null = null;
  selectedJob: any;
  selectedJobLogs: any;
  loadjobdetails: boolean = false;
  isAccordionOpenStatus = false;
  isAccordionOpen2: boolean = true;
  getJobStatusTitle(): string {
    return this.selectedJobLogs?.length
      ? this.selectedJobLogs[0].title
      : 'No Job Status';
  }
  toggleAccordionStatus() {
    this.isAccordionOpenStatus = !this.isAccordionOpenStatus;
  }
  handleClick(index: number, item: any) {
    this.orderGetDetails.forEach((job: any, i: any) => {
      if (i !== index) {
        job.isOpen = false;
      }
    });
    item.isOpen = !item.isOpen;
    if (item.isOpen) {
      this.fetchjobLogs(item);
    }
  }
  toggleCollapse(index: number, job: any): void {
    this.loadjobdetails = true;
    setTimeout(() => {
      this.selectedJob = job;
      this.fetchJobDetailsWithFeedback(job);
    }, 200);
    this.clearMarkers();
    this.openIndex = this.openIndex === index ? null : index;
  }
  clearMarkers() {
    if (this.technicianMarker) {
      this.technicianMarker = null;
      this.technicianCoords = '';
    }
    if (this.customerMarker) {
      this.customerMarker = null;
    }
  }
  resetMap(): void {
    if (this.mapElement) {
      const mapContainer = this.mapElement.nativeElement;
    }
  }
  fetchjobLogs(jobCardId: any) {
    this.selectedJobLogs = [];
    const filter: any = {
      $and: [
        { ORDER_ID: { $in: [Number(jobCardId.ORDER_ID)] } },
        { JOB_CARD_ID: { $in: [Number(jobCardId.JOB_CARD_ID)] } },
        { LOG_TYPE: { $in: ['Job'] } },
      ],
    };
    this.loadingOrderStatus = jobCardId.JOB_CARD_ID;
    this.apiservice
      .getjoborderLogs(
        1,
        10,
        'DATE_TIME',
        'ASC',
        filter,
        Number(jobCardId.ORDER_ID),
        Number(jobCardId.JOB_CARD_ID),
        'J'
      )
      .subscribe({
        next: (data) => {
          if (data?.code === 200) {
            this.selectedJobLogs = data.data.map(
              (log: any, index: any, array: any) => ({
                title: log.JOB_CARD_STATUS,
                date: this.datePipe.transform(
                  log.DATE_TIME,
                  'dd/MM/yyyy HH:mm a'
                ),
                description: log.ACTION_DETAILS,
                completed: true,
              })
            );
          }
          this.loadingOrderStatus = null;
        },
        error: (error) => {
          this.loadingOrderStatus = null;
        },
      });
  }
  profilephoto = "";
  fetchJobDetailsWithFeedback(jobItem: any) {
    this.loadingOrderStatus = jobItem.JOB_CARD_ID;
    this.apiservice
      .getfetchJobDetailsWithFeedback(
        this.userID,
        jobItem.ORDER_ID,
        jobItem.JOB_CARD_ID,
        'ID',
        'DESC'
      )
      .subscribe({
        next: (res) => {
          if (res?.code === 200) {
            jobItem.feedbackData = res.feedbackData?.length
              ? res.feedbackData[0]
              : null;
            this.selectedJob = {
              ...this.selectedJob,
              techData: res.techData?.length
                ? {
                  ID: res.techData[0].ID || 'N/A',
                  name: res.techData[0].NAME || 'N/A',
                  rating: res.techData[0].AVERAGE_REVIEW || '0.00',
                  jobCount: res.techData[0].job_count || '0',
                  status: res.techData[0].TECHNICIAN_STATUS || 'N/A',
                  jobCardStatus: res.techData[0].JOB_CARD_STATUS || 'N/A',
                  customerStatus: res.techData[0].CUSTOMER_STATUS || 'N/A',
                  trackStatus: res.techData[0].TRACK_STATUS || 'N/A',
                  profile_photo: res.techData[0].PROFILE_PHOTO || '',
                }
                : null,
              feedbackData: res.feedbackData?.length
                ? res.feedbackData[0]
                : null,
              isPartAdd: res.inventoryReq === 1,
              isPaymentReq: res.pendingPayment === 1,
              pendingPaymentsData: res.pendingPayments?.[0] || {},
              partData: res.jobData || [],
              paidPayments: res.PaidPayment || [],
            };
            this.profilephoto = res.techData[0]?.PROFILE_PHOTO;
            let obj = {
              ORDER_NO: this.ordernumber,
              JOB_CARD_NO: this.jobcardnumber,
              PROFILE_PHOTO: this.profilephoto
            }
            if (this.hasTechnicianData) {
              const decrypted = this.commonFunction.decryptdata(
                sessionStorage.getItem('TECHNICIAN_DATA')
              );
              let parsedData = [];
              try {
                parsedData = JSON.parse(decrypted) || [];
              } catch (err) {
                parsedData = [];
              }
              const exists = parsedData.some(data =>
                data.ORDER_NO === this.ordernumber && data.JOB_CARD_NO === this.jobcardnumber
              );
              if (!exists) {
                parsedData.push(obj);
                const encrypted = this.commonFunction.encryptdata(
                  JSON.stringify(parsedData)
                );
                sessionStorage.setItem('TECHNICIAN_DATA', encrypted);
              } else {
                console.log('Technician data already exists for this order/job.');
              }
              this.profileData = parsedData;
            }
            else {
              this.profileData.push(obj)
              const encrypted = this.commonFunction.encryptdata(
                JSON.stringify(this.profileData)
              );
              sessionStorage.setItem('TECHNICIAN_DATA', encrypted);
            }
            this.getPartData(jobItem.JOB_CARD_ID);
            if (this.selectedJob?.techData?.trackStatus === 'ST') {
              this.isMapLoaded = false;
              const retryInterval = setInterval(() => {
                if (this.mapElement?.nativeElement) {
                  this.isMapLoaded = true;
                  this.getUserLocation();
                  clearInterval(retryInterval);
                } else {
                }
              }, 100);
            }
            jobItem.techData = this.selectedJob.techData;
            jobItem.isPartAdd = this.selectedJob.isPartAdd;
            jobItem.isPaymentReq = this.selectedJob.isPaymentReq;
            jobItem.pendingPaymentsData = this.selectedJob.pendingPaymentsData;
            jobItem.partData = this.selectedJob.partData;
            this.jobItem = jobItem;
          }
          this.loadjobdetails = false;
          this.loadingOrderStatus = null;

          // Check for query parameters to open drawer automatically
          const openPartPayment = this.route.snapshot.queryParamMap.get('openPartPayment');
          const openPartDetails = this.route.snapshot.queryParamMap.get('openPartDetails');
          const openChat = this.route.snapshot.queryParamMap.get('openChat');

          if (openPartPayment === 'true') {
            this.openPartDetailsDrawer(this.selectedJob, 'PP');
            this.router.navigate([], { queryParams: { openPartPayment: null }, queryParamsHandling: 'merge' });
          } else if (openPartDetails === 'true') {
            this.openPartDetailsDrawer(this.selectedJob, 'PD');
            this.router.navigate([], { queryParams: { openPartDetails: null }, queryParamsHandling: 'merge' });
          } else if (openChat === 'true') {
            this.chatwithcustomer(this.selectedJob);
            setTimeout(() => {
              const chatOffcanvas = document.getElementById('offcanvasRightttttttt');
              if (chatOffcanvas) {
                let offcanvasInstance = bootstrap.Offcanvas.getInstance(chatOffcanvas);
                if (!offcanvasInstance) {
                  offcanvasInstance = new bootstrap.Offcanvas(chatOffcanvas);
                }
                offcanvasInstance.show();
              }
            }, 500);
            this.router.navigate([], { queryParams: { openChat: null }, queryParamsHandling: 'merge' });
          }



        },

        error: (error) => {
          this.loadingOrderStatus = null;
        },
      });
  }
  loadingParts: boolean = false;
  PartDetails: any = [];
  getPartData(data: any) {
    this.loadingParts = true;
    this.apiservice
      .getPartInfoForOrder(
        0,
        0,
        'id',
        'desc',
        `AND CUSTOMER_ID = ${this.userID} AND JOB_CARD_ID = ${data} AND STATUS = 'P'`
      )
      .subscribe({
        next: (response) => {
          if (response?.code === 200) {
            this.PartDetails = response.data;
          }
          this.loadingParts = false;
        },
        error: (err) => {
          this.loadingParts = false;
        },
      });
  }
  PaymentSummary: any = [];
  isLoadingPartPay: boolean = false;
  openPartDetailsDrawer(data: any, status: any) {
    let filter = `AND CUSTOMER_ID = ${this.userID} AND JOB_CARD_ID = ${data.JOB_CARD_ID}`;
    filter += status === 'PD' ? ` AND STATUS = 'P'` : ` AND STATUS = 'AC'`;
    this.loadingParts = true;
    const fetchPartDetails = () => {
      this.apiservice
        .getPartInfoForOrder(0, 0, 'id', 'desc', filter + ' AND IS_RETURNED=0')
        .subscribe({
          next: (response) => {
            if (response?.code === 200) {
              this.PartDetails = response.data;
              const offcanvasElement =
                document.getElementById('partDetailsDrawer');
              if (offcanvasElement) {
                const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
                offcanvas.show();
              }
            }
            this.loadingParts = false;
          },
          error: (err) => {
            this.loadingParts = false;
          },
        });
    };
    if (status === 'PP') {
      let innerdatafilter = `AND CUSTOMER_ID = ${this.userID} AND JOB_CARD_ID = ${data.JOB_CARD_ID} AND PAYMENT_STATUS = 'P'`;
      this.apiservice
        .getPaymentSummary(0, 0, 'id', 'desc', innerdatafilter)
        .subscribe({
          next: (payresponse) => {
            if (payresponse?.code === 200) {
              this.PaymentSummary = payresponse.data[0];
            }
            fetchPartDetails();
          },
          error: (err) => {
            fetchPartDetails();
          },
        });
    } else {
      fetchPartDetails();
    }
  }
  getTotalAmount(): number {
    return this.PartDetails?.reduce(
      (sum: any, part: any) => sum + (Number(part.TOTAL_AMOUNT) || 0),
      0
    );
  }
  RAZOR_PAY_KEY = environment.razorPayKey;
  selectedPaymentMethod: string = 'ONLINE';
  proceedToPay(selectedjob: any, PaymentSummary: any) {
    this.isLoadingPartPay = true;
    const finalAmount = this.getTotalAmount();
    if (this.selectedPaymentMethod === 'COD') {
      const payload = {
        ORDER_ID: selectedjob?.ORDER_ID || null,
        CUSTOMER_ID: this.userID,
        JOB_CARD_ID: selectedjob?.JOB_CARD_ID,
        JOB_CARD_NO: selectedjob?.JOB_CARD_NO,
        TECHNICIAN_ID: selectedjob?.TECHNICIAN_ID,
        VENDOR_ID: selectedjob?.VENDOR_ID,
        MOBILE_NUMBER: this.userName,
        PAYMENT_FOR: 'P',
        PAYMENT_MODE: 'C',
        PAYMENT_TYPE: 'C',
        TRANSACTION_DATE: moment().format('YYYY-MM-DD'),
        TRANSACTION_ID: null,
        TRANSACTION_STATUS: 'Success',
        TRANSACTION_AMOUNT: finalAmount,
        PAYLOAD: {},
        RESPONSE_DATA: {},
        RESPONSE_CODE: 200,
        MERCHANT_ID: this.RAZOR_PAY_KEY,
        RESPONSE_MESSAGE: 'Order placed via COD',
        CLIENT_ID: 1,
      };
      this.apiservice.addPaymentTransactions(payload).subscribe(
        (response: any) => {
          this.isLoadingPartPay = false;
          if (response?.code === 200) {
            this.message.success(
              'Payment successful. Your order has been placed!',
              ''
            );
            this.cancel();
          } else {
            this.message.error(
              'Payment successful, but order processing failed. Please contact support.',
              ''
            );
            this.cancel();
          }
        },
        (error) => {
          this.isLoadingPartPay = false;
          this.message.error('Failed to place order. Please try again.', '');
        }
      );
    } else {
      var dataForRzpOrder = {
        CART_ID: 0,
        ORDER_ID: selectedjob?.ORDER_ID || 0,
        CUSTOMER_ID: this.userID,
        JOB_CARD_ID: selectedjob?.JOB_CARD_ID,
        PAYMENT_FOR: 'P',
        amount: finalAmount * 100,
      };
      this.apiservice.createRazorpayOrdertoRzp(dataForRzpOrder).subscribe(
        (responserzp: any) => {
          if (responserzp?.code === 200 && responserzp.data.amount) {
            const options = {
              key: this.RAZOR_PAY_KEY,
              amount: finalAmount * 100,
              currency: 'INR',
              name: this.userName,
              order_id: responserzp.data.id,
              description: 'Order Payment',
              handler: (data: any) => {
                const body = {
                  ORDER_ID: selectedjob?.ORDER_ID || null,
                  CUSTOMER_ID: this.userID,
                  JOB_CARD_ID: selectedjob?.JOB_CARD_ID,
                  JOB_CARD_NO: selectedjob?.JOB_CARD_NO,
                  TECHNICIAN_ID: selectedjob?.TECHNICIAN_ID,
                  VENDOR_ID: selectedjob?.VENDOR_ID,
                  MOBILE_NUMBER: this.userName,
                  PAYMENT_FOR: 'P',
                  PAYMENT_MODE: 'O',
                  PAYMENT_TYPE: 'O',
                  TRANSACTION_DATE: moment().format('YYYY-MM-DD'),
                  TRANSACTION_ID: data.razorpay_payment_id,
                  TRANSACTION_STATUS: 'Success',
                  TRANSACTION_AMOUNT: finalAmount,
                  PAYLOAD: options,
                  RESPONSE_DATA: data,
                  RESPONSE_CODE: 200,
                  MERCHANT_ID: this.RAZOR_PAY_KEY,
                  RESPONSE_MESSAGE: 'Transaction success',
                  CLIENT_ID: 1,
                };
                this.apiservice.addPaymentTransactions(body).subscribe(
                  (response: any) => {
                    this.isLoadingPartPay = false;
                    if (response?.code === 200) {
                      this.message.success(
                        'Payment successful. Your order has been placed successfully!',
                        ''
                      );
                      this.cancel();
                    } else {
                      this.message.error(
                        'Payment successful, but order processing failed. Please contact support.',
                        ''
                      );
                      this.cancel();
                    }
                  },
                  (error) => {
                    this.isLoadingPartPay = false;
                    this.message.error(
                      'An error occurred while updating payment status.',
                      ''
                    );
                  }
                );
              },
              prefill: {
                name: this.userName,
                contact: this.userMobileNo,
              },
              theme: {
                color: '#3399cc',
              },
              modal: {
                ondismiss: () => {
                  this.isLoadingPartPay = false;
                },
              },
            };
            const razorpay = new Razorpay(options);
            razorpay.open();
            razorpay.on('payment.failed', () => {
              this.isLoadingPartPay = false;
              this.message.error('Payment Failed..', '');
            });
          } else {
            this.isLoadingPartPay = false;
            this.message.error(responserzp.data.error.description, '');
          }
        },
        (err) => {
          this.isLoadingPartPay = false;
          this.message.error(err.error.data.error.description, '');
        }
      );
    }
  }
  cancel() {
    this.fetchJobDetailsWithFeedback(this.selectedJob);
    this.isLoadingPartPay = false;
    this.closeDrawer();
  }
  acceptPartRequest(status: string) {
    try {
      this.loadingParts = true;
      if (!this.selectedJob || !this.PartDetails.length) {
        this.loadingParts = false;
        this.message.warning('No parts available to process.');
        return;
      }
      const body = {
        CUSTOMER_ID: this.userID,
        TECHNICIAN_ID: this.selectedJob?.TECHNICIAN_ID,
        TECHNICIAN_NAME: this.selectedJob?.TECHNICIAN_NAME,
        ORDER_ID: this.selectedJob?.ORDER_ID,
        JOB_CARD_ID: this.selectedJob?.JOB_CARD_ID,
        JOB_CARD_NO: this.selectedJob?.JOB_CARD_NO,
        REQUEST_MASTER_ID: this.PartDetails[0]['REQUEST_MASTER_ID'],
        INVENTORY_IDS: JSON.stringify(
          this.PartDetails.map((item: any) => item.INVENTORY_ID)
        ),
        IDS: JSON.stringify(this.PartDetails.map((item: any) => item.ID)),
        STATUS: status,
        CLIENT_ID: 1,
      };
      this.apiservice.AddUpdatePartRequest(body).subscribe(
        (res) => {
          this.loadingParts = false;
          if (res?.code == 200) {
            if (status == 'A') {
              this.message.success('Parts request accepted successfully.');
              this.closeDrawer();
              this.fetchJobDetailsWithFeedback(this.selectedJob);
            } else {
              this.message.warning('Parts request denied.');
              this.closeDrawer();
              this.fetchJobDetailsWithFeedback(this.selectedJob);
            }
          } else {
            this.message.error('Failed to update request. Please try again.');
          }
        },
        (error) => {
          this.loadingParts = false;
          this.message.error('An error occurred while processing the request.');
        }
      );
    } catch (error) {
      this.loadingParts = false;
      this.message.error('Unexpected error occurred. Please try again.');
    }
  }
  closeDrawer() {
    this.fetchJobDetailsWithFeedback(this.selectedJob);
    const serviceDrawer = document.getElementById('partDetailsDrawer');
    if (serviceDrawer) {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(serviceDrawer);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    }
  }
  denyPartRequest() { }
  trackingInterval: any;
  distanceDiv: HTMLDivElement | null = null;
  getUserLocation() {
    if (!navigator.geolocation) {
      return;
    }
    if (!this.orderGetDetails || !this.orderGetDetails.length) {
      return;
    }
    const orderDetail = this.orderGetDetails[0];
    const latitude = orderDetail.LATITUDE;
    const longitude = orderDetail.LONGITUDE;
    if (latitude && longitude) {
      this.customerCoords = {
        latitude: Number(latitude),
        longitude: Number(longitude),
      };
      this.currentCoords = { ...this.customerCoords };
      this.initMap();
      this.updateCustomerMarker();
    } else {
      return;
    }
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }
    this.trackingInterval = setInterval(() => {
      this.fetchTechnicianLocation();
    }, 5000);
  }
  fetchTechnicianLocation() {
    this.locationService
      .getLocation(this.selectedJob?.JOB_CARD_ID)
      .subscribe((loc) => {
        if (loc && loc.latitude && loc.longitude) {
          this.ngZone.run(() => {
            this.technicianCoords = {
              latitude: loc.latitude,
              longitude: loc.longitude,
            };
            if (!this.map) {
              return;
            }
            this.fetchRoute();
          });
        }
      });
  }
  initMap() {
    if (!this.mapElement?.nativeElement) {
      return;
    }
    const centerLatLng = new google.maps.LatLng(
      this.customerCoords.latitude,
      this.customerCoords.longitude
    );
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: centerLatLng,
    });
    this.polyline = new google.maps.Polyline({
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      map: this.map,
    });
  }
  updateCustomerMarker() {
    const customerLatLng = new google.maps.LatLng(
      this.customerCoords.latitude,
      this.customerCoords.longitude
    );
    if (!this.customerMarker) {
      this.customerMarker = new google.maps.Marker({
        position: customerLatLng,
        map: this.map,
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' },
        title: 'Customer',
      });
    } else {
      this.customerMarker.setPosition(customerLatLng);
    }
  }
  updateTechnicianMarker() {
    const techLatLng = new google.maps.LatLng(
      this.technicianCoords.latitude,
      this.technicianCoords.longitude
    );
    if (!this.technicianMarker) {
      this.technicianMarker = new google.maps.Marker({
        position: techLatLng,
        map: this.map,
        icon: {
          url: 'assets/img/technician.png',
          scaledSize: new google.maps.Size(40, 40),
        },
        title: 'Technician',
      });
    } else {
      this.technicianMarker.setPosition(techLatLng);
    }
  }
  distanceText: string = '';
  fetchRoute() {
    if (!this.technicianCoords || !this.customerCoords) {
      return;
    }
    const requestBody = {
      origin: {
        location: {
          latLng: {
            latitude: this.technicianCoords.latitude,
            longitude: this.technicianCoords.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: this.customerCoords.latitude,
            longitude: this.customerCoords.longitude,
          },
        },
      },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
      polylineEncoding: 'ENCODED_POLYLINE',
    };
    fetch(
      `https://routes.googleapis.com/directions/v2:computeRoutes?key=AIzaSyBOL8XUOxJicHzlQRGi27Wdn5M3zazFKTU`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask':
            'routes.polyline.encodedPolyline,routes.distanceMeters',
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const encodedPolyline = data.routes[0].polyline.encodedPolyline;
          const distanceMeters = data.routes[0].distanceMeters;
          const distanceKm = (distanceMeters / 1000).toFixed(2);
          this.distanceText = `Total Distance: ${distanceKm} km`;
          this.clearDistanceDisplay();
          this.drawPolyline(encodedPolyline);
          this.showDistance();
          this.updateTechnicianMarker();
        } else {
        }
      });
  }
  drawPolyline(encodedPolyline: string) {
    const decodedPath =
      google.maps.geometry.encoding.decodePath(encodedPolyline);
    if (!this.polyline) {
      this.polyline = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: '#007BFF',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: this.map,
      });
    } else {
      this.polyline.setPath(decodedPath);
    }
  }
  showDistance() {
    this.clearDistanceDisplay();
    this.distanceDiv = document.createElement('div');
    this.distanceDiv.style.position = 'absolute';
    this.distanceDiv.style.bottom = '20px';
    this.distanceDiv.style.left = '50%';
    this.distanceDiv.style.transform = 'translateX(-50%)';
    this.distanceDiv.style.background = '#fff';
    this.distanceDiv.style.padding = '10px 20px';
    this.distanceDiv.style.border = '1px solid #ccc';
    this.distanceDiv.style.borderRadius = '5px';
    this.distanceDiv.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.3)';
    this.distanceDiv.style.fontSize = '16px';
    this.distanceDiv.style.fontWeight = 'bold';
    this.distanceDiv.innerText = this.distanceText;
    this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
      this.distanceDiv
    );
  }
  clearDistanceDisplay() {
    if (this.distanceDiv) {
      this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
      this.distanceDiv = null;
    }
  }
  isAccordionOpen1: boolean = true;
  isAccordionOpen3: boolean = false;
  isAccordionOpenPartData: boolean = false;
  isAccordionOpenRateUs: boolean = false;
  toggleAccordion12() {
    this.isAccordionOpen1 = !this.isAccordionOpen1;
  }
  toggleAccordion2() {
    this.isAccordionOpen2 = !this.isAccordionOpen2;
  }
  toggleAccordion3() {
    this.isAccordionOpen3 = !this.isAccordionOpen3;
  }
  toggleAccordionRateUs() {
    this.isAccordionOpenRateUs = !this.isAccordionOpenRateUs;
  }
  toggleAccordionPartData() {
    this.isAccordionOpenPartData = !this.isAccordionOpenPartData;
  }
  toggleAccordion2323(job: any, section: string) {
    const key = `${job.JOB_CARD_ID}_${section}`;
    if (this.activeAccordion1212 === key) {
      this.activeAccordion1212 = null;
    } else {
      this.activeAccordion1212 = key;
      if (section === 'orderStatus') {
        this.fetchjobLogs(job);
      } else {
        this.fetchJobDetailsWithFeedback(job);
      }
    }
  }
  jobItem: any;
  feedback = {
    serviceRating: 0,
    technicianRating: 0,
    comment: '',
    comment1: '',
  };
  rating = 0;
  techRating = 0;
  openFeedbackModal() {
    let modalElement = document.getElementById('feedbackModal');
    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  closeFeedbackModal() {
    let modalElement = document.getElementById('feedbackModal');
    if (modalElement) {
      let modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
  setRating(star: number, type: 'service' | 'technician') {
    if (type === 'service') {
      this.feedback.serviceRating = star;
      this.rating = star;
    } else {
      this.feedback.technicianRating = star;
      this.techRating = star;
    }
  }
  formatPeriod(days: number): string {
    if (!days || isNaN(days)) return '-';
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} ${years > 1 ? 'yrs' : 'yr'}`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} ${months > 1 ? 'months' : 'month'}`;
    } else {
      return `${days} ${days > 1 ? 'days' : 'day'}`;
    }
  }
  formatPeriodCommon(days: number): string {
    if (!days || isNaN(days)) return '-';
    const years = Math.floor(days / 365);
    const remainingDaysAfterYears = days % 365;
    const months = Math.floor(remainingDaysAfterYears / 30);
    const remainingDays = remainingDaysAfterYears % 30;
    let result: string[] = [];
    if (years > 0) {
      result.push(`${years} ${years > 1 ? 'yrs' : 'year'}`);
    }
    if (months > 0) {
      result.push(`${months} ${months > 1 ? 'months' : 'month'}`);
    }
    if (remainingDays > 0) {
      result.push(`${remainingDays} ${remainingDays > 1 ? 'days' : 'day'}`);
    }
    return result.length > 0 ? result.join(' ') : '-';
  }
  calculateExpirationDate(days: number): string {
    if (!days || isNaN(days)) {
      return '-';
    }
    return 'Valid upto ' + moment().add(days, 'days').format('DD/MMM/YY');
  }
  getStars(rating: string | number): string[] {
    const fullStars = Math.floor(Number(rating));
    const emptyStars = 5 - fullStars;
    return [
      ...Array(fullStars).fill('bi-star-fill text-warning fs-6'),
      ...Array(emptyStars).fill('bi-star text-secondary fs-6'),
    ];
  }
  submitFeedback() {
    if (this.selectedJob) {
      const body = {
        ORDER_ID: this.selectedJob.ORDER_ID,
        CUSTOMER_ID: this.userID,
        SERVICE_ID: this.selectedJob.SERVICE_ITEM_ID,
        JOB_CARD_ID: this.selectedJob.JOB_CARD_ID,
        SERVICE_RATING: this.feedback.serviceRating,
        TECHNICIAN_RATING: this.feedback.technicianRating,
        TECHNICIAN_COMMENTS: this.feedback.comment1,
        SERVICE_COMMENTS: this.feedback.comment,
        TECHNICIAN_ID: this.selectedJob.TECHNICIAN_ID,
        TECHNICIAN_NAME: this.selectedJob.TECHNICIAN_NAME,
        CUSTOMER_NAME: this.userName,
        ORDER_NUMBER: this.selectedJob.ORDER_NUMBER,
      };
      this.apiservice.RateUS(body).subscribe(
        (response: any) => {
          if (response?.code === 200) {
            this.message.success('Feedback submitted successfully', '');
            this.fetchJobDetailsWithFeedback(this.selectedJob);
            this.closeFeedbackModal();
          } else {
            this.message.error('Failed to submit feedback', '');
          }
        },
        (error) => {
          this.message.error('Something went wrong. Please try again.');
        }
      );
    } else {
      this.message.error('Job not found. Please try again.');
    }
  }
  toggleJobDetails(jobId: string) {
    this.orderDetailsVisible[jobId] = !this.orderDetailsVisible[jobId];
  }
  orderDetailsVisible: { [key: string]: boolean } = {
    contactDetails: false,
    orderStatus: false,
    reschedulePolicy: false,
    cancelPolicy: false,
    paymentSummary: false,
  };
  orderDetailsVisible2: { [key: string]: boolean } = {};
  orderDetailsVisible22: { [key: string]: boolean } = {};
  toggleAccordion22(jobId: string, sectionType: string) {
    const key = `${jobId}_${sectionType}`;
    this.orderDetailsVisible[key] = !this.orderDetailsVisible[key];
  }
  truncateWords(text: string, limit: number = 2): string {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > limit
      ? words.slice(0, limit).join(' ') + '...'
      : text;
  }
  activeAccordion1212: string | null = null;
  joborderstatus: any;
  loadingOrderStatus: string | null = null;
  toggleAccordion(section: string) {
    this.orderDetailsVisible[section] = !this.orderDetailsVisible[section];
  }
  orderDetailsVisible1: { [key: string]: boolean } = {};
  toggleAccordion1(jobId: number) {
    this.orderDetailsVisible[jobId] = !this.orderDetailsVisible[jobId];
  }
  chatwith: any = '';
  jobdataaaaa: any;
  chatshow: boolean = false;
  chatwithcustomer(job: any) {
    sessionStorage.setItem('msgget', 'no');
    this.jobdataaaaa = job;
    this.chatshow = true;
    this.BODY_TEXT = null;
    this.ICON = null;
    this.chatwith = this.jobdataaaaa.TECHNICIAN_NAME;
    this.getmsgs();
  }
  isSpinning: boolean = false;
  showimagebox: boolean = false;
  progressBarImageOne: any;
  msgspin: boolean = false;
  BODY_TEXT: any;
  groupeddata: any;
  allchatmsg: any;
  @ViewChild('scrollableDivvvvv')
  scrollableDivvvvv!: ElementRef<HTMLDivElement>;
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  getmsgs() {
    this.msgspin = true;
    var filter = {
      $and: [
        { CUSTOMER_ID: this.jobdataaaaa.CUSTOMER_ID },
        { JOB_CARD_ID: this.jobdataaaaa.JOB_CARD_ID },
      ],
    };
    this.apiservice.getchat(0, 0, '_id', 'asc', filter).subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          this.allchatmsg = data['data'];
          sessionStorage.setItem('newmsg', 'false');
          this.groupeddata = this.groupDataBySendDate(this.allchatmsg);
          this.msgspin = false;
          var channelNames = [
            'chat_' +
            this.jobdataaaaa.JOB_CARD_ID +
            '_customer_' +
            this.jobdataaaaa.CUSTOMER_ID +
            '_channel',
          ];
          this.apiservice
            .subscribeToMultipleTopics(channelNames)
            .subscribe((data) => {
              if (data['code'] == '200') {
              }
            });
          setTimeout(() => {
            const div = this.scrollableDivvvvv.nativeElement;
            div.scrollTop = div.scrollHeight;
          }, 500);
        } else {
          if (data['count'] == 0) {
            if (
              localStorage.getItem('channel_nameforchat') == null ||
              localStorage.getItem('channel_nameforchat') == undefined ||
              localStorage.getItem('channel_nameforchat') == ''
            ) {
              var dataaaaa = {
                CHANNEL_NAME:
                  'chat_' +
                  this.jobdataaaaa.JOB_CARD_ID +
                  '_customer_' +
                  this.jobdataaaaa.CUSTOMER_ID +
                  '_channel',
                USER_ID: this.userID,
                STATUS: true,
                CLIENT_ID: 1,
                USER_NAME: this.jobdataaaaa.CUSTOMER_NAME,
                TYPE: 'C',
                DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
              };
              localStorage.setItem(
                'channel_nameforchat',
                dataaaaa.CHANNEL_NAME
              );
              this.apiservice.createChannels(dataaaaa).subscribe((data) => {
                if (data['status'] === 200) {
                  var channelNames = [dataaaaa.CHANNEL_NAME];
                  this.apiservice
                    .subscribeToMultipleTopics(channelNames)
                    .subscribe((data) => {
                      if (data['code'] == '200') {
                      }
                    });
                }
              });
            }
          }
        }
        this.msgspin = false;
      }
    });
  }
  getmsgssssss() {
    if (sessionStorage.getItem('msgget') == 'yes' && this.chatshow == true) {
      sessionStorage.setItem('msgget', 'no');
      this.messageListener();
    } else {
    }
  }
  closechat() {
    sessionStorage.setItem('msgget', 'no');
    sessionStorage.setItem('chatopen', 'false');
    this.BODY_TEXT = '';
    this.ICON = null;
    this.showimagebox = false;
    this.jobdataaaaa = null;
    this.chatshow = false;
  }
  urllll = this.apiservice.retriveimgUrl;
  groupDataBySendDate(data: any[]): { [key: string]: any[] } {
    return data.reduce((groupedData, item) => {
      const sendDate = new Date(item.SEND_DATE).toISOString().split('T')[0];
      if (!groupedData[sendDate]) {
        groupedData[sendDate] = [];
      }
      groupedData[sendDate].push(item);
      return groupedData;
    }, {});
  }
  getMediaType(url: string): string {
    if (!url) return '';
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension && imageExtensions.includes(extension)) {
      return 'I';
    } else if (extension && videoExtensions.includes(extension)) {
      return 'V';
    }
    return '';
  }
  public commonFunction = new CommonFunctionService();
  sendmessage() {
    this.isSpinning = true;
    if (
      (this.BODY_TEXT === '' ||
        this.BODY_TEXT === undefined ||
        this.BODY_TEXT === null) &&
      (this.ICON == '' || this.ICON == undefined || this.ICON == null)
    ) {
      this.message.error('Please enter message');
      this.isSpinning = false;
      return;
    } else {
      if (
        this.BODY_TEXT === '' ||
        this.BODY_TEXT === undefined ||
        this.BODY_TEXT === null
      ) {
      } else {
        const boldPattern = /\*(.*?)\*/g;
        this.BODY_TEXT = this.BODY_TEXT.replace(boldPattern, '<b>$1</b>');
      }
    }
    const mediaType = this.getMediaType(this.ICON);
    var dataaa = {
      ORDER_ID: this.jobdataaaaa.ORDER_ID,
      ORDER_NUMBER: this.jobdataaaaa.ORDER_NO,
      JOB_CARD_ID: this.jobdataaaaa.JOB_CARD_ID,
      CUSTOMER_ID: this.jobdataaaaa.CUSTOMER_ID,
      TECHNICIAN_ID: this.jobdataaaaa.TECHNICIAN_ID,
      MESSAGE: this.BODY_TEXT,
      SENDER_USER_ID: this.jobdataaaaa.CUSTOMER_ID,
      RECIPIENT_USER_ID: this.jobdataaaaa.TECHNICIAN_ID,
      CLIENT_ID: 1,
      JOB_CARD_NUMBER: this.jobdataaaaa.JOB_CARD_NO,
      CUSTOMER_NAME: this.jobdataaaaa.CONTACT_PERSON_NAME,
      TECHNICIAN_NAME: this.jobdataaaaa.TECHNICIAN_NAME,
      CREATED_DATETIME: this.datePipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      ),
      STATUS: 'D',
      BY_CUSTOMER: true,
      SENDER_USER_ID_USER: this.jobdataaaaa.CUSTOMER_NAME,
      RECIPIENT_USER_NAME: this.jobdataaaaa.TECHNICIAN_NAME,
      SEND_DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      RECEIVED_DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      ATTACHMENT_URL: this.ICON,
      IS_DELIVERED: true,
      MEDIA_TYPE: mediaType,
    };
    this.apiservice.createchat(dataaa).subscribe(
      (successCode: any) => {
        if (successCode.code == '200') {
          this.BODY_TEXT = '';
          this.ICON = null;
          this.showimagebox = false;
          this.getmsgs();
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.isSpinning = false;
        if (err.status === 0) {
          this.message.error(
            'Unable to connect. Please check your internet or server connection and try again shortly.',
            ''
          );
        } else {
          this.message.error('Something Went Wrong.', '');
        }
      }
    );
  }
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/\n/g, '<br/>');
  }
  ICON: any = '';
  imageshow: any;
  UrlImageOne: any;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024;
    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'video/mp4'
    ) {
      this.fileURL = <File>event.target.files[0];
      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        return;
      }
      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.UrlImageOne = url;
        if (this.ICON != undefined && this.ICON.trim() != '') {
          var arr = this.ICON.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarImageOne = true;
      this.urlImageOneShow = true;
      this.isSpinning = true;
      this.timer = this.apiservice
        .onUpload('OrderChat', this.fileURL, this.UrlImageOne)
        .subscribe((res) => {
          this.ICON = this.UrlImageOne;
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentImageOne = percentDone;
            if (this.percentImageOne == 100) {
              this.isSpinning = false;
              setTimeout(() => {
                this.progressBarImageOne = false;
              }, 2000);
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            this.ICON = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.isSpinning = false;
              this.ICON = this.UrlImageOne;
              this.showimagebox = true;
            } else {
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.ICON = null;
            }
          }
        });
    } else {
      this.message.error('Please Select Only Image File', '');
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.ICON = null;
    }
  }
  Date: any;
  BODY_VALUES: any;
  inputBody: any;
  handleEnter(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'b') {
      this.makeBold();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      this.BODY_TEXT =
        this.BODY_TEXT.slice(0, start) + '\n' + this.BODY_TEXT.slice(end);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      });
    }
  }
  makeBold(): void {
    const textarea = document.getElementById(
      'messages2'
    ) as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start !== end) {
      const selectedText = this.BODY_TEXT.substring(start, end);
      const boldText = `*${selectedText}*`;
      this.BODY_TEXT =
        this.BODY_TEXT.slice(0, start) + boldText + this.BODY_TEXT.slice(end);
      textarea.value = this.BODY_TEXT;
      textarea.selectionStart = textarea.selectionEnd = end + 7;
    }
  }
  jobcardid: any;
  isShowTicket(item: any): boolean {
    if (this.orderGetDetails.length === 0) return false;
    return item.JOB_STATUS === 'AS';
  }
  isFAQDrawerVisible: boolean = false;
  sendjobid(item: any) {
    this.jobcardid = item.JOB_CARD_ID;
  }
  orderdetailsnew: any;
  openticketdrawer(item: any) {
    this.orderdetailsnew = item;
    this.jobcardid = item.JOB_CARD_ID;
    this.isFAQDrawerVisible = true;
    setTimeout(() => {
      const faqDrawer = document.getElementById('offcanvasFAQ');
      if (faqDrawer) {
        const offcanvasInstance = new bootstrap.Offcanvas(faqDrawer);
        offcanvasInstance.show();
      }
    }, 100);
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
  @ViewChild('closefaq') closefaq!: any;
  FAQdrawerClose() {
    this.isFAQDrawerVisible = false;
    setTimeout(() => {
      const faqDrawer = document.getElementById('offcanvasFAQ');
      if (faqDrawer) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(faqDrawer);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }
      setTimeout(() => {
        if (
          !this.isFAQDrawerVisible &&
          !document.getElementById('showtickets')?.classList.contains('show')
        ) {
          this.resetBodyStyles();
        }
        this.removeBackdrops();
      }, 500);
    }, 300);
  }
  resetBodyStyles() {
    document.body.classList.remove('offcanvas-open');
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '';
    if (document.body.hasAttribute('data-bs-overflow')) {
      document.body.removeAttribute('data-bs-overflow');
    }
    if (document.body.hasAttribute('data-bs-padding-right')) {
      document.body.removeAttribute('data-bs-padding-right');
    }
  }
  removeBackdrops() {
    document
      .querySelectorAll('.offcanvas-backdrop')
      .forEach((backdrop) => backdrop.remove());
  }
  get FAQcloseCallback() {
    return this.FAQdrawerClose.bind(this);
  }
  messageListener() {
    if (
      sessionStorage.getItem('msgdata') != null &&
      sessionStorage.getItem('msgdata') != undefined &&
      sessionStorage.getItem('msgdata') != ''
    ) {
      sessionStorage.setItem('msgget', 'no');
      var event: any = JSON.parse(sessionStorage.getItem('msgdata') || '');
      var obj = JSON.parse(event.data.data4);
      delete obj.authData;
      this.allchatmsg = [...this?.allchatmsg, ...[obj]];
      this.groupeddata = this.groupDataBySendDate(this.allchatmsg);
      this.msgspin = false;
      setTimeout(() => {
        const div = this.scrollableDivvvvv.nativeElement;
        div.scrollTop = div.scrollHeight;
      }, 500);
    } else {
      sessionStorage.setItem('msgget', 'no');
    }
  }
  getFirstLine(name: string): string {
    if (!name) return '';
    const parts = name.split(',');
    if (parts.length <= 2) return name;
    return parts.slice(0, 2).join(',');
  }
  getSecondLine(name: string): string {
    if (!name) return '';
    const parts = name.split(',');
    if (parts.length <= 2) return '';
    return parts.slice(2).join(',').trim();
  }
}
