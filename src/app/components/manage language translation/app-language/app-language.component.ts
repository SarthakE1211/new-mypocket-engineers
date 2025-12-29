import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LoaderService } from 'src/app/Service/loader.service';
import { ModalService } from 'src/app/Service/modal.service';

@Component({
  selector: 'app-app-language',
  templateUrl: './app-language.component.html',
  styleUrls: ['./app-language.component.scss'],
})
export class AppLanguageComponent {
  @Input() drawerClose!: Function;
  @Input() isDrawerVisible: boolean = false;
  // @Input() data: any;
  close() {
    this.drawerClose();
    // this.fetchTicketData();
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
    private loaderService: LoaderService,
    private translate: TranslateService
  ) // private toastr: ToastrService

  {}
  ngOnInit(): void {
    this.getLanguageData();
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

  gotoSettings() {
    // this.showContent = 'settingsTab';
    // this.getuserList();
  }

  appLanguageLoading: boolean = false;
  selectedLanguage: any;
  appLanguageData: any = [];
  getLanguageData() {
    this.appLanguageLoading = true;
    this.apiservice
      .getAppLanguageData(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE =1 ')
      .subscribe({
        next: (data: any) => {
          if (data.data.length > 0) {
            this.appLanguageData = data.data;
            const englishLanguage = this.appLanguageData.find(
              (lang: any) => lang.NAME.toLowerCase() === 'english'
            );
            if (englishLanguage) {
              this.selectedLanguage = englishLanguage.ID;
            }
          } else {
            this.appLanguageData = [
              {
                ID: '1',
                NAME: 'English',
              },
            ];
            this.selectedLanguage = '1';
          }

          this.appLanguageLoading = false; // Hide loading state
        },
        error: (error: any) => {
          this.appLanguageData = []; // Clear data on error
          this.appLanguageLoading = false; // Hide loading state
        },
      });
  }

  onLanguageChange(data: any) {
    this.selectedLanguage = data.ID;
    // this.translate.use(data);
    // selectedLanguage
    this.getJsondata(data);
    localStorage.setItem('selectedLanguage', data);
  }
  datalist: any = [];
  translationData: any = [];
  datalist2: any = [];

  getJsondata(data: any) {
    if (data && data.ID) {
      // this.loadingRecords = true;
      this.apiservice.getAppLanguageDataFilterwise(data.ID).subscribe(
        (data) => {
          if (data['status'] === 200) {
            // this.loadingRecords = false;

            this.translationData = data.body['DRAFT_JSON'];
            var defaultJson = data.body['DRAFT_JSON'];
            // Extract the selected language name from translationData
            data.NAME =
              data.body.data.length > 0 ? data.body.data[0].NAME : 'English';

            this.datalist = Object.keys(defaultJson).map((key, value) => ({
              KEY: key,
              ENGLISH: defaultJson[value], // English value from default JSON
              TRANSLATION: defaultJson[value], // Take from draft JSON if available
            }));

            const draftJson2 = data.body['DEAFULT_JSON'] || [];

            this.datalist2 = Object.keys(draftJson2).map((key) => ({
              TRANSLATION: draftJson2[key] || '',
            }));

            // const selectedLanguage =
            //   translationData.length > 0
            //     ? translationData[0].NAME // Selected language name
            //     : "English"; // Default to English if no language is selected

            // Prepare data for the selected language
            // this.datalist = defaultJson.map((item: any) => ({
            //   KEY: item.KEY,
            //   ENGLISH: item.ENGLISH,
            //   TRANSLATION: item[this.data.NAME.toUpperCase()], // Use the selected language's translation, fallback to English
            // }));

            // this.data.NAME = selectedLanguage; // Set the selected language dynamically for display
          } else {
            // this.loadingRecords = false;
            this.datalist = [];
            this.message.error('Failed To Load Json Data...', '');
          }
        },
        () => {
          // this.loadingRecords = false;
          this.message.error('Something Went Wrong...', '');
        }
      );
    }
  }
}