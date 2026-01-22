import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { format, addDays, startOfMonth, endOfMonth } from 'date-fns';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ModalService } from 'src/app/Service/modal.service';
@Component({
  selector: 'app-multiple-checkout-order-drawer',
  templateUrl: './multiple-checkout-order-drawer.component.html',
  styleUrls: ['./multiple-checkout-order-drawer.component.scss'],
})
export class MultipleCheckoutOrderDrawerComponent {
  @Input() drawerData: any;
  @Input() isDrawerVisible: any;
  @Input() CartID: any;
  @Input() isExpressOn: any;
  @Input() updatedselectedService: any;
  isFocused: string = '';
  @Output() closeDrawerEvent = new EventEmitter<void>(); 
  TerritoryData: any = [];
  isLoading = false; 
  userID: any = this.apiservice.getUserId();
  selectedService: any;
  today = new Date();
  selectedDate: string = format(this.today, 'EEE, MMM d, yyyy'); 
  dates: { display: string; fullDate: string }[] = [];
  DefaultAddressArray: any;
  loadepage: any;
  timeSlots = [
    {
      period: 'Morning',
      times: { start: '09:00', end: '12:00', disabled: false }, 
    },
    {
      period: 'Afternoon',
      times: { start: '12:00', end: '15:00', disabled: false },
    },
    {
      period: 'Evening',
      times: { start: '15:00', end: '24:00', disabled: false }, 
    },
  ];
  selectedSlot: string = ''; 
  constructor(
    private router: Router,
    private cookie: CookieService,
    private message: ToastrService,
    private datePipe: DatePipe,
    private apiservice: ApiServiceService,
    private renderer: Renderer2,
    private modalservice: ModalService
  ) {
    this.generateDates();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isDrawerVisible']) {
      if (this.drawerData && Array.isArray(this.drawerData)) {
        const expressRecords = this.drawerData.filter(
          (data: any) => data.isExpress === 1
        );
      }
      this.getTerriotory();
    }
  }
  formatTime(time: string): string {
    let [hours, minutes] = time.split(':').map(Number);
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  ngOnInit() {
    this.getAddresses1();
  }
  ngAfterViewInit(): void {
    document.body.style.overflow = 'hidden';
  }
  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }
  generateDates() {
    this.dates = []; 
    const startDate = this.today; 
    const endDate = addDays(startDate, 30); 
    let currentDate = startDate;
    while (currentDate <= endDate) {
      this.dates.push({
        display: format(currentDate, 'EEE d'),
        fullDate: format(currentDate, 'EEE, MMM d, yyyy'), 
      });
      currentDate = addDays(currentDate, 1);
    }
  }
  getAddresses1() {
    this.apiservice
      .getAddresses1data(
        0,
        0,
       'IS_DEFAULT',
        'desc',
        ' AND CUSTOMER_ID = ' + this.userID + ' AND STATUS = 1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.DefaultAddressArray = data['data'];
            this.getTerriotory();
          }
        },
        (error) => {}
      );
  }
  getTerriotory() {
    if (!this.DefaultAddressArray || this.DefaultAddressArray.length === 0) {
      return;
    }
    this.loadepage = true;
    this.apiservice
      .Getterritory(
        0,
        0,
        '',
        '',
        ' AND ID = ' + this.DefaultAddressArray[0]?.TERRITORY_ID
      )
      .subscribe(
        (response) => {
          if (response?.code === 200) {
            this.TerritoryData = response.data;
            if (this.TerritoryData?.length > 0) {
              if (this.dates?.length > 0) {
                this.getCartSlots(this.TerritoryData);
              } else {
              }
            } else {
            }
          } else {
            this.TerritoryData = [];
          }
          this.loadepage = false;
        },
        (error) => {
          this.loadepage = false;
        }
      );
  }
  getCartSlots(cartId: any) {
    if (!cartId || cartId.length === 0 || !cartId[0]?.ID) {
      return;
    }
    const cartID = cartId[0]['ID'];
    this.apiservice.CartslotGet(this.userID, cartID).subscribe(
      (response) => {
        if (response?.code === 200 && response.data?.length > 0) {
          const slot = response.data[0]; 
          this.timeSlots = [
            {
              period: 'Morning',
              times: {
                start: slot?.SLOT1_START_TIME?.slice(0, 5) || '09:00',
                end: slot?.SLOT1_END_TIME?.slice(0, 5) || '12:00',
                disabled: false,
              },
            },
            {
              period: 'Afternoon',
              times: {
                start: slot?.SLOT2_START_TIME?.slice(0, 5) || '12:00',
                end: slot?.SLOT2_END_TIME?.slice(0, 5) || '15:00',
                disabled: false,
              },
            },
            {
              period: 'Evening',
              times: {
                start: slot?.SLOT3_START_TIME?.slice(0, 5) || '15:00',
                end:
                  slot?.SLOT3_END_TIME === '23:00:00'
                    ? '23:59'
                    : slot?.SLOT3_END_TIME?.slice(0, 5) || '23:00',
                disabled: false,
              },
            },
          ];
          this.selectedDate = this.dates[0].fullDate; 
          this.updateTimeSlots(this.selectedDate); 
        } else {
        }
      },
      (error) => {}
    );
  }
  IS_EXPRESS_Update: boolean = false;
  toggleExpressService() {
    this.IS_EXPRESS_Update = !this.IS_EXPRESS_Update;
  }
  selectDate(date: string) {
    this.selectedSlot = ''; 
    this.selectedDate = date;
    if (this.TerritoryData && this.TerritoryData.length > 0) {
      this.updateTimeSlots(date);
    } else {
      const interval = setInterval(() => {
        if (this.TerritoryData && this.TerritoryData.length > 0) {
          clearInterval(interval);
          this.updateTimeSlots(date);
        }
      }, 100);
    }
  }
  MaxEndValue: any;
  updateTimeSlots(date: any) {
    const activeTerritory = this.TerritoryData?.find(
      (t: any) => t.IS_ACTIVE === 1
    );
    if (!activeTerritory) {
      return;
    }
    const selectedDateMoment = moment(date, 'ddd, MMM D, YYYY');
    if (!Array.isArray(this.updatedselectedService)) {
      this.updatedselectedService = [];
    }
    if (!this.timeSlots || this.timeSlots.length === 0) {
      return;
    }
    const { serviceStart, serviceEnd }: any =
      this.getServiceTimeRange(selectedDateMoment);
    this.timeSlots = this.timeSlots.map((period, index) => {
      const slotStart = moment(period.times.start, 'HH:mm');
      const slotEnd = moment(period.times.end, 'HH:mm');
      const isServiceStartWithinSlot =
        serviceStart.isSameOrAfter(slotStart) && serviceStart.isBefore(slotEnd);
      const isServiceEndWithinSlot =
        serviceEnd.isSameOrAfter(slotStart) && serviceEnd.isBefore(slotEnd);
      const isSlotWithinService =
        slotStart.isSameOrAfter(serviceStart) &&
        slotEnd.isSameOrBefore(serviceEnd);
      const isValid =
        serviceEnd.diff(serviceStart) >= 0 &&
        (isServiceStartWithinSlot ||
          isServiceEndWithinSlot ||
          isSlotWithinService);
      return {
        ...period,
        times: {
          ...period.times,
          disabled: !isValid,
        },
      };
    });
  }
  getServiceTimeRange(selectedDate: moment.Moment) {
    const territory = this.TerritoryData?.find((t: any) => t.IS_ACTIVE === 1);
    if (!territory) {
      return { serviceStart: null, serviceEnd: null };
    }
    const startTimeArray = [
      ...this.updatedselectedService.map((service: any) => {
        const time = moment(service.START_TIME, 'hh:mm A'); 
        return time;
      }),
      moment(territory.START_TIME, 'HH:mm:ss'), 
    ].filter((time) => time.isValid());
    const endTimeArray = [
      ...this.updatedselectedService.map((service: any) => {
        const time = moment(service.END_TIME, 'hh:mm A'); 
        return time;
      }),
      moment(territory.END_TIME, 'HH:mm:ss'), 
    ].filter((time) => time.isValid());
    if (selectedDate.isSame(moment(), 'day')) {
      const maxPreparationMinutes = this.updatedselectedService.reduce(
        (maxTime: number, service: any) => {
          const totalMinutes =
            parseInt(service.PREPARATION_HOURS || 0, 10) * 60 +
            parseInt(service.PREPARATION_MINUTES || 0, 10);
          return Math.max(maxTime, totalMinutes);
        },
        0
      );
      if (maxPreparationMinutes > 0) {
        const prepTime = moment().add(maxPreparationMinutes, 'minutes');
        startTimeArray.push(prepTime);
      }
    }
    const serviceStart = moment.max(startTimeArray);
    const serviceEnd = moment.min(endTimeArray);
    this.MaxEndValue = serviceStart.format('hh:mm A'); 
    return { serviceStart, serviceEnd };
  }
  selectSlot(times: any) {
    this.selectedSlot =
      this.formatTime(times.start) + ' - ' + this.formatTime(times.end);
  }
  isAllSlotsDisabled(): boolean {
    return this.timeSlots?.every((slot) => slot.times.disabled);
  }
  remark: any;
  roundTimeToInterval(time: string, interval: number): string {
    let timeMoment = moment(time, 'hh:mm A');
    let minutes = timeMoment.minutes();
    let remainder = minutes % interval;
    if (remainder !== 0) {
      timeMoment.add(interval - remainder, 'minutes');
    }
    timeMoment.seconds(0);
    return timeMoment.format('HH:mm:ss');
  }
  bookNow() {
    if (!this.selectedDate) {
      this.message.warning(
        'Please select a date before proceeding with the order.'
      );
      return;
    }
    if (!this.selectedSlot) {
      this.message.warning(
        'Please select a time slot before proceeding with the order.'
      );
      return;
    }
    this.isLoading = true;
    try {
      const [startTime, endTime] = this.selectedSlot.split(' - ');
      const formattedDate = this.datePipe.transform(
        this.selectedDate,
        'yyyy-MM-dd'
      );
      const formattedStartTime = moment(startTime, 'hh:mm A').format(
        'HH:mm:ss'
      );
      const formattedEndTime = moment(endTime, 'hh:mm A').format('HH:mm:ss');
      const today = moment().format('YYYY-MM-DD');
      const maxEndMoment = moment(
        `${today} ${this.MaxEndValue}`,
        'YYYY-MM-DD hh:mm A'
      );
      const slotStartMoment = moment(
        `${today} ${formattedStartTime}`,
        'YYYY-MM-DD HH:mm:ss'
      );
      const slotEndMoment = moment(
        `${today} ${formattedEndTime}`,
        'YYYY-MM-DD HH:mm:ss'
      );
      let expectedTime: string;
      if (maxEndMoment.isBefore(slotStartMoment)) {
        expectedTime = formattedStartTime;
      } else if (
        maxEndMoment.isBetween(slotStartMoment, slotEndMoment, undefined, '[]')
      ) {
        expectedTime = maxEndMoment.format('HH:mm:ss');
      } else {
        expectedTime = formattedEndTime;
      }
      let roundedTimeMoment = moment(expectedTime, 'HH:mm:ss');
      const minutes = roundedTimeMoment.minutes();
      const remainder = minutes % 10;
      if (remainder !== 0) {
        roundedTimeMoment.add(10 - remainder, 'minutes').seconds(0);
      } else {
        roundedTimeMoment.seconds(0); 
      }
      expectedTime = roundedTimeMoment.format('HH:mm:ss');
      const expectedDateTime = `${formattedDate} ${expectedTime}`;
      const payload = {
        SCHEDULE_DATE: formattedDate,
        SCHEDULE_START_TIME: formattedStartTime,
        SCHEDULE_END_TIME: formattedEndTime,
        EXPECTED_DATE_TIME: expectedDateTime,
        IS_EXPRESS: this.IS_EXPRESS_Update ? 1 : 0,
        REMARK: this.remark || '',
        CART_ID: this.CartID,
      };
      this.apiservice.BookOrder(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.code === 200) {
            this.router.navigate(['/order-review', this.CartID]);
          } else {
            this.message.error(
              ' Unable to schedule your order. Please try again.'
            );
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.message.error(
            'An error occurred while scheduling your order. Please try again.'
          );
        },
      });
    } catch (error) {
      this.isLoading = false;
      this.message.error('⚠ Something went wrong. Please try again.');
    }
  }
  closeData() {
    this.closeDrawerEvent.emit(); 
  }
}
