import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ToastrService } from "ngx-toastr";
import { Meta, Title } from '@angular/platform-browser';
import * as bootstrap from 'bootstrap';
import * as moment from 'moment';
@Component({
  selector: 'app-shoporder-details',
  templateUrl: './shoporder-details.component.html',
  styleUrls: ['./shoporder-details.component.scss']
})
export class ShoporderDetailsComponent {
  type = 'shop'
  constructor(private route: ActivatedRoute, private router: Router, private apiservice: ApiServiceService, private message: ToastrService,
    private metaService: Meta,
    private titleService: Title) { this.updateSEO() }
  updateSEO() {
    this.titleService.setTitle('Order Details & Tracking - PockIT Web');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Track your order details at PockIT Web. View order summary, estimated delivery time, and payment details for your purchased items.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'order tracking, order details, online purchase summary, delivery status, secure payment confirmation, invoice details',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Order Details & Tracking - PockIT Web',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Check your order status and delivery details at PockIT Web. Secure shopping and real-time order tracking for your purchases.',
    });
    this.metaService.updateTag({
      name: 'twitter:title',
      content: 'Order Details & Tracking - PockIT Web',
    });
    this.metaService.updateTag({
      name: 'twitter:description',
      content:
        'Track your order details and check delivery status for your PockIT Web purchases.',
    });
    this.metaService.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    let link: HTMLLinkElement =
      document.querySelector("link[rel='canonical']") ||
      document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.href);
    document.head.appendChild(link);
  }
  userID: any = this.apiservice.getUserId();
  IMAGEuRL: any;
  orderID: any;
  currentterritory: any;
  ShopserviceId: any
  ngOnInit() {
    const rawValue = sessionStorage.getItem('CurrentTerritory');
    if (rawValue && !isNaN(Number(rawValue))) {
      this.currentterritory = Number(rawValue);
    } else {
      this.currentterritory = 0; 
    }
    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    this.ShopserviceId = this.route.snapshot.paramMap.get('id');
    this.ShopOrderstatus(this.ShopserviceId)
    this.ShopOrderCardData(this.ShopserviceId)
    if (this.ShopserviceId) {
      this.orderID = this.ShopserviceId;
    }
    setTimeout(() => {
      if (document.documentElement.scrollHeight <= window.innerHeight) {
        document.body.style.overflowY = 'auto'; 
      } else {
        document.body.style.overflowY = ''; 
      }
    }, 300); 
  }
  isCollapsed = false;
  isSubmitted: boolean = false; 
  isAccordionOpen: boolean = true;
  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }
  isLoading: boolean = false; 
  orderGetDetails: any[] = [];
  latitude: any;
  longitude: any;
  fetchOrderDetails(serviceId: string) {
    this.isLoading = true; 
    this.apiservice.getOrderDetails(this.userID, serviceId).subscribe({
      next: (data) => {
        if (data?.code === 200) {
          this.orderGetDetails = data.data;
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
  reasonsisLoading: boolean = false;
  comment: string = '';
  cancelReasons: any;
  openDrawer(type: string) {
    if (type === 'cancel') {
      this.reasonsisLoading = true; 
      this.apiservice
        .getCancellationReason(
          0,
          0,
          'id',
          'asc',
          ` AND IS_ACTIVE = 1 AND TYPE = 'CO' AND REASON_FOR = 'P'`
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
    this.apiservice.addShopOrderCancellationTransaction(body).subscribe(
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
  handleImageError(event: any) {
    event.target.src = 'assets/img/services/no-image.png'; 
  }
  openDialer(phoneNumber: string) {
    window.location.href = `tel:${phoneNumber}`;
  }
  ClickTrack(data: any) {
    let url = data?.trim();
    if (data) {
      const hasProtocol = /^https?:\/\//i.test(url);
      const finalUrl = hasProtocol ? url : `https://${url}`;
      window.open(finalUrl, '_blank');
    } else {
      alert('Invalid or missing courier tracking URL.');
    }
  }
  Shopordersstatus: any[] = []; 
  Feedbackdata: any = []
  feedbacksubmitted: boolean = false;
  Feedback(ShopserviceId: any) {
    this.apiservice.getFeedbackData(0, 0, 'id', 'desc', `AND ORDER_ID =` + ShopserviceId)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200 && response.body && response.body.data) {
            this.Feedbackdata = response.body.data;
            if (this.Feedbackdata.length > 0) {
              this.RATING = this.Feedbackdata[0].RATING;
              this.COMMENTS = this.Feedbackdata[0].COMMENTS;
              this.feedbacksubmitted = true;
            }
          } else {
            this.Feedbackdata = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
        (err: HttpErrorResponse) => {
          this.Feedbackdata = [];
          if (err.status === 0) {
            this.message.error('Network error: Please check your internet connection.', '');
          } else {
            this.message.error(`HTTP Error: ${err.status}. Something Went Wrong.`, '');
          }
        }
      );
  }
  gettrackurlBoole: boolean = false;
  TrackingURL: any;
  TrackOrderGetURL() {
    this.gettrackurlBoole = true;
    this.apiservice.fetfedbackURL(this.orderdataarray.AWB_CODE)
      .subscribe(
        (response) => {
          if (response.body.DATA.tracking_data !== undefined && response.body.DATA.tracking_data !== null && response.body.DATA.tracking_data !== '') {
            const trackingData = response.body.DATA.tracking_data;
            if (trackingData.track_url && trackingData.track_url.trim() !== '') {
              window.open(trackingData.track_url, '_blank');
            } else {
            }
            this.gettrackurlBoole = false;
          } else {
            this.gettrackurlBoole = false;
            this.message.error("Something went wrong, please try again later", '');
          }
        },
        (err: HttpErrorResponse) => {
          this.gettrackurlBoole = false;
          this.message.error('Network error: Please check your internet connection.', '');
        }
      );
  }
  ShopOrderstatus(ShopserviceId: any) {
    this.apiservice.getShoporderStatusData(ShopserviceId)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200 && response.body && response.body.data) {
            this.Shopordersstatus = response.body.data;
          } else {
            this.Shopordersstatus = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
        (err: HttpErrorResponse) => {
          if (err.status === 0) {
            this.message.error('Network error: Please check your internet connection.', '');
          } else {
            this.message.error(`HTTP Error: ${err.status}. Something Went Wrong.`, '');
          }
        }
      );
  }
  OrderCardDataForRating: any
  INVENTORY_ID: any
  OrderCardData: any = []
  OrderDetailsData: any = []
  OrderSummaryData: any = []
  OrderAddressData: any = []
  Orderdata: any
  RejectRemark: any; 
  orderdataarray: any = [];
  shoporderid: any;
  loaddata: boolean = false;
  warrentydata: any
  shopalldata: any
  isWarrantyValid(): boolean {
    const warranty = this.warrentydata;
    if (!warranty || warranty.WARRANTY_ALLOWED !== 1) return false;
    const startDate = new Date(warranty.ORDER_DATE_TIME); 
    const today = new Date();
    const warrantyEndDate = new Date(startDate);
    warrantyEndDate.setDate(warrantyEndDate.getDate() + warranty.WARRANTY_PERIOD);
    return today <= warrantyEndDate;
  }
  ShopOrderCardData(ShopserviceId: any) {
    this.loaddata = true;
    this.apiservice.getshopeOrderData(ShopserviceId)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200 && response.body && response.body.orderData && response.body.detailsData && response.body.summaryData && response.body.addressData) {
            this.loaddata = false;
            this.OrderCardData = response.body.orderData[0].ORDER_STATUS;
            this.Orderdata = response.body.orderData[0].ESTIMATED_DATE_TIME;
            this.RejectRemark = response.body.orderData[0].REJECTION_REMARK;
            this.OrderCardDataForRating = response.body.orderData[0].ORDER_STATUS;
            this.OrderDetailsData = response.body.detailsData;
            this.INVENTORY_ID = response.body.detailsData[0].INVENTORY_ID;
            this.OrderSummaryData = response.body.summaryData;
            this.OrderAddressData = response.body.addressData;
            this.orderdataarray = response.body.orderData[0]
            this.shopalldata = response.body.orderData[0]
            this.warrentydata = response.body.detailsData[0]
            this.shoporderid = response.body.orderData[0].ID
            if (this.orderdataarray.ORDER_STATUS == 'OS') {
              this.Feedback(this.ShopserviceId);
            }
          } else {
            this.OrderCardData = [];
            this.loaddata = false;
            this.message.error(`Something went wrong.`, '');
          }
        },
        (err: HttpErrorResponse) => {
          this.loaddata = false;
          if (err.status === 0) {
            this.message.error('Network error: Please check your internet connection.', '');
          } else {
            this.message.error(`HTTP Error: ${err.status}. Something Went Wrong.`, '');
          }
        }
      );
  }
  RATING: number = 0; 
  COMMENTS: any;
  setRating(value: number) {
    this.RATING = value; 
  }
  UserID = this.apiservice.getUserId()
  openFeedbackModal() {
    const modalElement = document.getElementById('feedbackModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  closeFeedbackModal() {
    const modalElement = document.getElementById('feedbackModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  }
  SubmitRating() {
    const FEEDBACK_DATE_TIME = new Date().toISOString();
    if (!this.RATING || this.RATING === 0) {
      this.message.error('Please provide a rating between 1 and 5.', '');
      return;
    }
    if (!this.COMMENTS || this.COMMENTS.trim() === '') {
      this.message.error('Please enter your feedback', '');
      return;
    }
    this.isSubmitted = true;
    this.apiservice.createRating(this.ShopserviceId, this.UserID, this.INVENTORY_ID, this.RATING, this.COMMENTS, FEEDBACK_DATE_TIME)
      .subscribe(
        (response: HttpResponse<any>) => {
          this.isSubmitted = false;
          if (response.status === 200) {
            this.message.success('Feedback submitted successfully', '');
            this.closeFeedbackModal();
            this.Feedback(this.ShopserviceId);
          } else {
            this.message.error('Failed to submit feedback', '');
          }
        },
        (err) => {
          this.isSubmitted = false;
          this.message.error('Something went wrong. Please try again later.', '');
        }
      );
  }
  isShowMenu(): boolean {
    if (this.orderdataarray.length === 0) return false;
    const order = this.orderdataarray[0];
    return (
      (this.OrderCardData === 'OP'
        || order.ORDER_STATUS === 'OA'
      )
      && order.REFUND_STATUS !== 'P'
    )
      || (order.ORDER_STATUS === 'CO' && this.apiservice.getCustomerType() === 'I');
  }
  isShowTicket(): boolean {
    if (this.orderdataarray.length === 0) return false;
    return this.orderdataarray[0].ORDER_STATUS === 'CO';
  }
  isFAQDrawerVisible: boolean = false;
  openticketdrawer() {
    this.isFAQDrawerVisible = true;
    setTimeout(() => {
      const faqDrawer = document.getElementById('offcanvasFAQ');
      if (faqDrawer) {
        const offcanvasInstance = new bootstrap.Offcanvas(faqDrawer);
        offcanvasInstance.show();
      }
    }, 100); setTimeout(() => {
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
    this.closefaq.nativeElement.click();
    this.isFAQDrawerVisible = false;
  }
  get FAQcloseCallback() {
    return this.FAQdrawerClose.bind(this);
  }
  openwaranteecard(dataa: any) {
    var waranteecard: any;
    waranteecard = this.IMAGEuRL + 'WarrantyCard/' + dataa;
    window.open(waranteecard, '_blank');
  }
  downloadshopinvoice(url: any) {
    var shopinvoiceurl: any;
    shopinvoiceurl = this.IMAGEuRL + 'Invoices/' + url;
    window.open(shopinvoiceurl, '_blank');
  }
}
