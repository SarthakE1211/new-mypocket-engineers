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
  selector: 'app-reschedule-time-slot-drawer',
  templateUrl: './reschedule-time-slot-drawer.component.html',
  styleUrls: ['./reschedule-time-slot-drawer.component.scss'],
})
export class RescheduleTimeSlotDrawerComponent {
  @Input() data: any;
  @Input() isDrawerVisible: any;
  @Input() rescheduleComment: any;
  @Input() selectedReasons: any;
  isFocused: string = '';

  @Output() closeDrawerEvent = new EventEmitter<void>(); // 👈 Add Output

  TerritoryData: any = [];
  isLoading = false; // Add this property in your component
  userID: any = this.apiservice.getUserId();
  selectedService: any;
  today = new Date();
  selectedDate: string = format(this.today, 'EEE, MMM d, yyyy'); // Default to today
  dates: { display: string; fullDate: string }[] = [];
  DefaultAddressArray: any;
  loadepage: any;
  timeSlots = [
    {
      period: 'Morning',
      times: { start: '09:00', end: '12:00', disabled: false }, // 24-hour format
    },
    {
      period: 'Afternoon',
      times: { start: '12:00', end: '15:00', disabled: false },
    },
    {
      period: 'Evening',
      times: { start: '15:00', end: '24:00', disabled: false }, // Change '12:00 AM' to '23:59'
    },
  ];
  selectedSlot: string = ''; // Stores the selected time slot
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
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.getTerriotory();
    }
  }

  formatTime(time: string): string {
    let [hours, minutes] = time.split(':').map(Number);
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert '00' or '12-23' to 12-hour format
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  ngOnInit() {
    // if (this.drawerData) {
    //   this.isExpressOn = this.drawerData.some((data: any) => data.IS_EXPRESS === 1);
    // }

    this.getAddresses1();

    setTimeout(() => {
      if (document.documentElement.scrollHeight <= window.innerHeight) {
        document.body.style.overflowY = 'auto'; // Force scrollbar if missing
      } else {
        document.body.style.overflowY = ''; // Keep default behavior
      }
    }, 300); // Delay to allow content to load
  }

  generateDates() {
    this.dates = []; // Clear previous dates to avoid duplicates
    const startDate = this.today; // Start from today
    const endDate = addDays(startDate, 30); // Go up to 30 days from today
    let currentDate = startDate;

    while (currentDate <= endDate) {
      this.dates.push({
        display: format(currentDate, 'EEE d'),
        fullDate: format(currentDate, 'EEE, MMM d, yyyy'), // Ensure format consistency
      });
      currentDate = addDays(currentDate, 1);
    }
    // this.getTerriotory();
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

  // Function to call CartslotGet and update time slots
  getCartSlots(cartId: any) {
    if (!cartId || cartId.length === 0 || !cartId[0]?.ID) {
      return;
    }

    const cartID = cartId[0]['ID'];

    this.apiservice.CartslotGet(this.userID, cartID).subscribe(
      (response) => {
        if (response?.code === 200 && response.data?.length > 0) {
          const slot = response.data[0]; // First object from response

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

          this.selectedDate = this.dates[0].fullDate; // Set first available date

          this.updateTimeSlots(this.selectedDate); // Call update function
        } else {
        }
      },
      (error) => {}
    );
  }
  IS_EXPRESS_Update: boolean = false;

  selectDate(date: string) {
    this.selectedSlot = ''; // Reset selected time slot when date changes
    this.selectedDate = date;

    // Wait until TerritoryData is available before updating time slots
    if (this.TerritoryData && this.TerritoryData.length > 0) {
      this.updateTimeSlots(date);
    } else {
      // Check periodically until TerritoryData is loaded
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

    if (!Array.isArray(this.data)) {
     
      this.data = [];
    }

    if (!this.timeSlots || this.timeSlots.length === 0) {
      return;
    }

    const { serviceStart, serviceEnd }: any =
      this.getServiceTimeRange(selectedDateMoment);

    this.timeSlots = this.timeSlots.map((period, index) => {
      const slotStart = moment(period.times.start, 'HH:mm');
      const slotEnd = moment(period.times.end, 'HH:mm');

      // Main Conditions:
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

    // Start Time Array
    const startTimeArray = [
      ...this.data.map((service: any) => {
        const time = moment(service.START_TIME, 'hh:mm A'); // Parsing 12-hour format
        return time;
      }),
      moment(territory.START_TIME, 'HH:mm:ss'), // Parsing 24-hour format
    ].filter((time) => time.isValid());

    // End Time Array
    const endTimeArray = [
      ...this.data.map((service: any) => {
        const time = moment(service.END_TIME, 'hh:mm A'); // Parsing 12-hour format
        return time;
      }),
      moment(territory.END_TIME, 'HH:mm:ss'), // Parsing 24-hour format
    ].filter((time) => time.isValid());

    // Preparation time for today
    if (selectedDate.isSame(moment(), 'day')) {
      const maxPreparationMinutes = this.data.reduce(
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

    this.MaxEndValue = serviceStart.format('hh:mm A'); // Keep if needed elsewhere

    return { serviceStart, serviceEnd };
  }

  // Method to select a time slot
  selectSlot(times: any) {
    this.selectedSlot =
      this.formatTime(times.start) + ' - ' + this.formatTime(times.end);
  }

  isAllSlotsDisabled(): boolean {
    return this.timeSlots?.every((slot) => slot.times.disabled);
  }

  remark: any;

  roundTimeToInterval(time: string, interval: number): string {
    // Parse time in hh:mm A format (e.g., 05:21 PM)
    let timeMoment = moment(time, 'hh:mm A');

    // Get current minutes
    let minutes = timeMoment.minutes();

    // Calculate remainder
    let remainder = minutes % interval;

    // If remainder > 0, round up to the next interval
    if (remainder !== 0) {
      timeMoment.add(interval - remainder, 'minutes');
    }

    // Set seconds to 0 (optional)
    timeMoment.seconds(0);

    // Return formatted time in HH:mm:ss
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

      // Correct parsing for MaxEndValue → 12-hour format with AM/PM
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

      // Now pure time comparison
      if (maxEndMoment.isBefore(slotStartMoment)) {
        expectedTime = formattedStartTime;
      } else if (
        maxEndMoment.isBetween(slotStartMoment, slotEndMoment, undefined, '[]')
      ) {
        expectedTime = maxEndMoment.format('HH:mm:ss');
      } else {
        expectedTime = formattedEndTime;
      }

      // Round expectedTime to nearest 10 mins
      let roundedTimeMoment = moment(expectedTime, 'HH:mm:ss');
      const minutes = roundedTimeMoment.minutes();
      const remainder = minutes % 10;
      if (remainder !== 0) {
        roundedTimeMoment.add(10 - remainder, 'minutes').seconds(0);
      } else {
        roundedTimeMoment.seconds(0); // Ensure seconds = 0 even if already on 10 min mark
      }
      expectedTime = roundedTimeMoment.format('HH:mm:ss');

      const expectedDateTime = `${formattedDate} ${expectedTime}`;

      // payload = {
      //   SCHEDULE_DATE: moment(date).format('YYYY-MM-DD'),
      //   REMARK: remark,
      //   IS_UPDATED_BY_CUSTOMER: 1,
      //   ORDER_STATUS: 'OS',
      //   ID: services[0].ORDER_ID,
      //   EXPECTED_DATE_TIME:
      //     moment(date).format('YYYY-MM-DD') +
      //     ' ' +
      //     moment(time?.startTime, 'HH:mm:ss').format(`HH:mm:ss`),

      // };

      // Prepare booking payload

      const payload = {
        SCHEDULE_DATE: formattedDate, // using already formatted date
        REMARK: this.remark || '',
        RESCHEDULE_REQUEST_REMARK: this.rescheduleComment || '',
        RESCHEDULE_REQUEST_REASON:
          this.selectedReasons
            .filter((r: any) => r.selected)
            .map((r: any) => r.label)
            .join(', ') || '', // Ensuring string format, preventing syntax issues
        IS_UPDATED_BY_CUSTOMER: 1,
        ORDER_STATUS: 'OS',
        ID: this.data[0]['ORDER_ID'], // Assuming same as services[0].ORDER_ID
        EXPECTED_DATE_TIME: `${formattedDate} ${moment(
          expectedTime,
          'HH:mm:ss'
        ).format('HH:mm:ss')}`,
      };

      // API call
      this.apiservice.orderUpdateStatus(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.code === 200) {
            this.message.success(
              'Your order has been successfully Rescheduled.'
            );

            // Route to order-details with ID from selectedService
            this.router.navigate(['/service']);
          } else {
            this.message.error(
              ' Unable to Reschedule your order. Please try again.'
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
    this.closeDrawerEvent.emit(); // Notify parent to close drawer
    this.rescheduleComment = '';
    this.selectedReasons = '';
  }
}
