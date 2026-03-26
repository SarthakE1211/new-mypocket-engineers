import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { CommonFunctionService } from './CommonFunctionService';
import { CookieService } from 'ngx-cookie-service';
import { Ticketfaqmapping } from '../components/models/TicketingSystem';
declare var bootstrap: any;
interface Coordinates {
  latitude: number;
  longitude: number;
}
interface DefaultTerritory {
  latitude: number;
  longitude: number;
  name: string;
}
const DEFAULT_PINCODE = '110001';
@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  public token: string;
  clientId: number = 1;
  cloudID: any;
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };
  httpHeaders1 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };

  //production
  // commoncode = 'https://console.pockitengineers.com/auth';
  // commonimgUrl = 'https://console.pockitengineers.com/auth/api/upload/';
  // weburl = 'https://my.pockitengineers.com/'
  // isLocalhost=false

  //pre prod
  commoncode = 'https://pockit.pockitengineers.com/auth';
  commonimgUrl = 'https://pockit.pockitengineers.com/auth/api/upload/';
  weburl = 'https://pockitapp.pockitengineers.com/'
  isLocalhost = false


  //testing
  // commoncode = 'https://pockitadmin.uvtechsoft.com:8767';
  // weburl = 'https://pockitapp.pockitengineers.com/'
  // commonimgUrl = 'https://pockitadmin.uvtechsoft.com:8767/api/upload/';
  // isLocalhost=false


  //local
  //   commoncode = 'https://1786vqrk-6787.inc1.devtunnels.ms';
  //   weburl = 'https://pockitapp.pockitengineers.com/'
  //   commonimgUrl = 'https://1786vqrk-6787.inc1.devtunnels.ms/api/upload/';
  // isLocalhost=true

  // commoncode = 'https://pn5m5nf6-9090.inc1.devtunnels.ms';
  // weburl = 'https://pockitapp.pockitengineers.com/'
  // commonimgUrl = 'https://pn5m5nf6-9090.inc1.devtunnels.ms/api/upload/';
  // isLocalhost = true
  commonapikey = 'WGykEs0b241gNKcDshYU9C4I0Ft1JoSb';
  commonapplicationkey = 'ZU63HDzj79PEFzz5';
  url = `${this.commoncode}/`;
  baseUrl = `${this.commoncode}/`;
  retriveimgUrl = `${this.commoncode}/static/`;
  setDefaultPincodeForHomeUser(explicitToken?: string): Observable<any> {
    const body = {
      PINCODE: DEFAULT_PINCODE,
      CUSTOMER_TYPE: 'I',
      TERRITORY_ID: '1',
      ADDRESS_TYPE: 'H',
      CUSTOMER_ID: this.getDecryptedItemlocal('userId') || '',
      DEFAULT_ADDRESS: true
    };
    const token = explicitToken || localStorage.getItem('token') || ' ';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient
      .post<any>(`${this.baseUrl}api/customerAddress/add`, body, {
        observe: 'response',
        headers: headers
      })
      .pipe(
        tap((response: any) => {
          if (response.body?.code === 200) {
            localStorage.setItem('userPincode', DEFAULT_PINCODE);
            localStorage.setItem('usingDefaultPincode', 'true');
            localStorage.setItem('selectedTerritory', '1');
            sessionStorage.setItem('userAddress', this.commonFunction.encryptdata('Delhi'));
          }
        }),
        catchError((error) => {
          console.error('Error setting default address:', error);
          return throwError(() => error);
        })
      );
  }
  getDefaultPincodeTerritories(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}territory/pincode/${DEFAULT_PINCODE}/territories`, {
        observe: 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching default pincode territories:', error);
          return throwError(() => error);
        })
      );
  }
  getTerritoriesByPincode(pincode: string): Observable<any> {
    if (!pincode) {
      pincode = DEFAULT_PINCODE;
    }
    return this.httpClient
      .get<any>(`${this.baseUrl}territory/pincode/${pincode}/territories`, {
        observe: 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching territories for pincode:', pincode, error);
          return throwError(() => error);
        })
      );
  }
  dateforlog = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
  emailId = sessionStorage.getItem('emailId');
  userId = Number(sessionStorage.getItem('userId'));
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  retriveimgUrl2(): string {
    return `${this.commoncode}/static/`;
  }
  Retrive(): string {
    return `${this.commoncode}/static/`;
  }
  getDefaultTerritories(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}territory/default/get`, {
        observe: 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching default territories:', error);
          return throwError(() => error);
        })
      );
  }
  public commonFunction = new CommonFunctionService();
  private getDecryptedItem(key: string): string {
    const storedValue = sessionStorage.getItem(key);
    return storedValue ? this.commonFunction.decryptdata(storedValue) : '';
  }
  public getDecryptedItemlocal(key: string): string {
    const storedValue1 = localStorage.getItem(key);
    return storedValue1 ? this.commonFunction.decryptdata(storedValue1) : '';
  }
  private getDecryptedItemfromlocal(key: string): string {
    const storedValue = localStorage.getItem(key);
    return storedValue ? this.commonFunction.decryptdata(storedValue) : '';
  }
  getsubscribedChannels(): string {
    return this.getDecryptedItemfromlocal('subscribedChannels');
  }
  getUserId(): any {
    const decryptedString = this.getDecryptedItem('userId');
    if (
      decryptedString === null ||
      decryptedString === undefined ||
      decryptedString === ''
    ) {
      return;
    }
    return parseInt(decryptedString, 10);
  }
  getUserName(): string {
    return this.getDecryptedItem('userName');
  }
  getEmail(): string {
    return this.getDecryptedItem('emailId');
  }
  getPlanFor(): string {
    return this.getDecryptedItem('planFor');
  }
  getUserAddress(): string {
    return this.getDecryptedItem('userAddress');
  }
  getUserAddressLocal(): string {
    return this.getDecryptedItemlocal('userAddress');
  }
  getSessionAddress(): any {
    return this.getDecryptedItem('defaultTeriotoryAddress');
  }
  getUsermobileNumber(): string {
    return this.getDecryptedItem('mobileNumber');
  }
  getUsermobileNumberlpcal(): string {
    return this.getDecryptedItemfromlocal('mobileNumber');
  }
  getCustomerType(): string {
    return this.getDecryptedItem('customertype');
  }
  private cartItems: any[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();
  addToCart(item: any) {
    this.cartItems.push(item);
    this.cartCount.next(this.cartItems.length);
  }
  getCartItems() {
    return this.cartItems;
  }
  private updateCartCount() {
    this.cartCount.next(this.cartItems.length);
  }
  clearCart() {
    this.cartItems = [];
    this.updateCartCount();
  }
  addItemToCart(item: any) {
    this.addToCart(item);
  }
  getLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position.coords);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }
  constructor(private httpClient: HttpClient, private cookie: CookieService) {
    this.token = localStorage.getItem('token') || ' ';
  }
  getSubscriptionList(ID: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: this.token,
    });
    return this.httpClient.get<any>(
      `${this.baseUrl}api/appUser/getSubscriptionDetails/${ID}`,
      {
        headers,
      }
    );
  }
  getBannerData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'banner/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getTopSellingLaptopsForWeb(
    sortKey: string = '',
    sortValue: string = ''): Observable<any> {
    var data = {
      sortKey: sortKey,
      sortValue: sortValue
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}app/getPopularInvenotry`,
      JSON.stringify(data),
      { headers }
    );
  }
  getAddresses1data(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + ' AND STATUS = 1 ',
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customerAddress/get',
      JSON.stringify(data),
      {
        headers: headers,
      }
    );
  }
  data: any = sessionStorage.getItem('token')
  getAddresses12data(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    token: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + ' AND STATUS = 1',
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customerAddress/get',
      JSON.stringify(data),
      { headers: headers }
    );
  }
  updateAddressToUpdateCart(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/address/update',
      JSON.stringify(data),
      {
        headers: headers,
        observe: 'response',
      }
    );
  }
  DeleteAddress(CUSTOMER_ID: any, ADDRESS_ID: any): Observable<any> {
    var data = {
      CUSTOMER_ID: CUSTOMER_ID,
      ADDRESS_ID: ADDRESS_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/customerAddress/deleteAddress',
      JSON.stringify(data),
      { headers }
    );
  }
  getterritoryPincodeData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'territory/pincode/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getfaqDatahead(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = ''
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(`${this.baseUrl}faqHead/get`, requestData, {
      headers,
    });
  }
  updateAddressDefault(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/customerAddress/updateAddressDefault',
      JSON.stringify(data),
      { headers }
    );
  }
  AddToCart(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/cart/add',
      JSON.stringify(data),
      { headers }
    );
  }
  getCustomerServiceFeedback(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'customerServiceFeedback/getCustomerServiceFeedback',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getPoppulerServices(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = '',
    TERRITORY_ID: number
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient
      .get<any>(`${this.baseUrl}app/getPoppulerServices/${TERRITORY_ID}`, {
        headers,
      })
      .pipe();
  }
  getPoppulerServicesForWeb(
    TERRITORY_ID: any,
    CUSTOMER_ID: any,
    CUSTOMER_TYPE: any,
    sortKey: string = '',
    sortValue: string = '',
  ): Observable<any> {
    const requestData = {
      TERRITORY_ID: TERRITORY_ID,
      CUSTOMER_ID: CUSTOMER_ID,
      CUSTOMER_TYPE: CUSTOMER_TYPE,
      sortKey: sortKey,
      sortValue: sortValue
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}app/getPoppulerServicesForWeb
 `,
      requestData,
      { headers }
    );
  }
  getServicesForWeb(
    TERRITORY_ID: any,
    CUSTOMER_ID: any,
    SUB_CATEGORY_ID: any,
    SEARCHKEY: any,
    PARENT_ID: any,
    CUSTOMER_TYPE: any,
    filter: any
  ): Observable<any> {
    const requestData = {
      TERRITORY_ID: TERRITORY_ID,
      CUSTOMER_ID: CUSTOMER_ID,
      SUB_CATEGORY_ID: SUB_CATEGORY_ID,
      SEARCHKEY: SEARCHKEY,
      PARENT_ID: PARENT_ID,
      CUSTOMER_TYPE: CUSTOMER_TYPE,
      filter: filter
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}order/getServicesForWeb`,
      requestData,
      { headers }
    );
  }
  getCategorieservices(TERRITORY_ID: any, CUSTOMER_TYPE: any, CUSTOMER_ID: any, sortKey: string = '',
    sortValue: string = ''): Observable<any> {
    const requestData = {
      TERRITORY_ID: TERRITORY_ID,
      CUSTOMER_TYPE: CUSTOMER_TYPE,
      CUSTOMER_ID: CUSTOMER_ID,
      sortKey,
      sortValue,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}app/ServiceCategory`,
      requestData,
      { headers }
    );
  }
  //////////////////////////////////////////
  getCategoriesServicesViewOnly(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = '',
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient
      .post<any>(
        `${this.baseUrl}serviceCategory/get`,
        JSON.stringify(requestData),
        { headers }
      )
      .pipe();
  }
  getSubCategoriesServicesViewOnly(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = '',
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient
      .post<any>(
        `${this.baseUrl}serviceSubCategory/get`,
        JSON.stringify(requestData),
        { headers }
      )
      .pipe();
  }
  getParentServicesViewOnly(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = '',
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient
      .post<any>(
        `${this.baseUrl}services/get`,
        JSON.stringify(requestData),
        { headers }
      )
      .pipe();
  }
  //////////////////////////////////////////////////
  getCategoriesServices(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = '',
    TERRITORY_ID: number,
    CUSTOMER_ID: number,
    CUSTOMER_TYPE: any
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
      TERRITORY_ID,
      CUSTOMER_ID,
      CUSTOMER_TYPE
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient
      .post<any>(
        `${this.baseUrl}order/getCategories/`,
        JSON.stringify(requestData),
        { headers }
      )
      .pipe();
  }
  getCategories(
    CUSTOMER_TYPE: string = '',
    PARENT_ID: number,
    SEARCHKEY: string = '',
    SUB_CATEGORY_ID: number,
    CUSTOMER_ID: number,
    TERRITORY_ID: number, sortKey: string = '',
    sortValue: string = '',
  ): Observable<any> {
    const requestData = {
      CUSTOMER_TYPE,
      PARENT_ID,
      SEARCHKEY,
      SUB_CATEGORY_ID,
      CUSTOMER_ID,
      TERRITORY_ID,
      sortKey,
      sortValue,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}order/getServices/`,
      requestData,
      { headers }
    );
  }
  onUpload(folderName: any, selectedFile: any, filename: any): Observable<any> {
    this.onuploadheader();
    let params = new HttpParams();
    const options1 = {
      headers: this.httpHeaders1,
      params: params,
      reportProgress: true,
    };
    const fd = new FormData();
    fd.append('Image', selectedFile, filename);
    const req = new HttpRequest(
      'POST',
      this.commonimgUrl + folderName,
      fd,
      options1
    );
    return this.httpClient.request(req);
  }
  onuploadheader() {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      supportkey: this.cookie.get('supportKey'),
      Token: localStorage.getItem('token') || ' ',
    });
    this.options1 = {
      headers: this.httpHeaders,
    };
  }
  getinventoryData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'inventory/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  CUSTOMER_TYPE: any = '';
  sendOTP(COUNTRY_CODE: any, TYPE_VALUE: any, TYPE: any, CUSTOMER_TYPE?: any): Observable<any> {
    const requestData: any = {
      COUNTRY_CODE,
      TYPE_VALUE,
      TYPE,
    };
    if (CUSTOMER_TYPE) {
      requestData.CUSTOMER_TYPE = CUSTOMER_TYPE;
      this.CUSTOMER_TYPE = CUSTOMER_TYPE;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: this.token,
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}customer/sendOTP`,
      requestData,
      { headers }
    );
  }
  companyname = localStorage.getItem('organizationName');
  verifyOTP(
    TYPE: any, TYPE_VALUE: any, OTP: any, USER_ID: any, CUSTOMER_NAME: any, CUSTOMER_CATEGORY_ID: any, CLOUD_ID: any, CUSTOMER_TYPE: any, COMPANY_NAME: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    var data = {
      TYPE: TYPE,
      TYPE_VALUE: TYPE_VALUE,
      OTP: OTP,
      USER_ID: USER_ID,
      CUSTOMER_NAME: CUSTOMER_NAME,
      CUSTOMER_CATEGORY_ID: CUSTOMER_CATEGORY_ID,
      CLOUD_ID: CLOUD_ID,
      CUSTOMER_TYPE: this.CUSTOMER_TYPE,
      COMPANY_NAME: this.companyname
    };
    return this.httpClient.post<any[]>(
      this.baseUrl + 'customer/verifyOTP',
      JSON.stringify(data),
      {
        headers: headers,
        observe: 'response',
      }
    );
  }
  userRegistration(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'customer/verifyOTP',
      JSON.stringify(data),
      {
        headers: headers,
        observe: 'response',
      }
    );
  }
  userRegistrationOTP(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'customer/registerOtp',
      JSON.stringify(data),
      {
        headers: headers,
        observe: 'response',
      }
    );
  }
  RegistrationCustomerAddress(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customerAddress/createAddress',
      JSON.stringify(data),
      {
        headers: headers,
        observe: 'response',
      }
    );
  }
  getPincodeData(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = ''
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}pincode/get`,
      requestData,
      {
        headers,
      }
    );
  }
  getTerretoryData(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = ''
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}territory/pincode/get`,
      requestData,
      {
        headers,
      }
    );
  }
  getStateData(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = ''
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(`${this.baseUrl}state/get`, requestData, {
      headers,
    });
  }
  getAppLanguageData(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = ''
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}api/appLanguage/get`,
      requestData,
      {
        headers,
      }
    );
  }
  getfaqData(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = ''
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(`${this.baseUrl}faq/get`, requestData, {
      headers,
    });
  }
  getUserData(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = ''
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}api/customer/get`,
      requestData,
      {
        headers: headers,
      }
    );
  }
  updateUserData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.put<any>(
      this.baseUrl + 'api/customer/update',
      JSON.stringify(data),
      {
        headers: headers,
        observe: 'response',
      }
    );
  }
  updateCustomerAddress(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.put<any>(
      this.baseUrl + 'api/customerAddress/updateAddress',
      JSON.stringify(data),
      {
        headers: headers,
        observe: 'response',
      }
    );
  }
  updateticket(ticket: any): Observable<any> {
    ticket['ORG_ID'] = Number(this.cookie.get('orgId'));
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.put<any>(
      this.url + 'api/ticket/update/',
      JSON.stringify(ticket),
      { headers: headers, observe: 'response' }
    );
  }
  CartGetforaddtocart1(
    customer_id: any,
    inventoryId: any,
    quantity: any,
    IS_TEMP_CART: any,
    STATE_ID: any,
    teritory_id: any,
    ADDRESS_ID: any,
    TYPE: any,
    SERVICE_ID: any,
    unit_id: any,
    quentity_per_unit: any,
    unit_name: any
  ): Observable<any> {
    var data = {
      CUSTOMER_ID: customer_id,
      INVENTORY_ID: inventoryId,
      QUANTITY: quantity,
      IS_TEMP_CART: IS_TEMP_CART,
      STATE_ID: STATE_ID,
      TERITORY_ID: teritory_id,
      ADDRESS_ID: ADDRESS_ID,
      TYPE: TYPE,
      SERVICE_ID: SERVICE_ID,
      UNIT_ID: unit_id,
      QUANTITY_PER_UNIT: quentity_per_unit,
      UNIT_NAME: unit_name,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/add',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getBrands(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'brand/get',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  InventoryCategoryget(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'app/getinventoryCategory',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  getinventoryunitMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'inventoryUnitMapping/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  inventoryImageMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'inventoryImageMapping/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  CartGet(
    customer_id: any,
    inventoryId: any,
    quantity: any,
    IS_TEMP_CART: any,
    STATE_ID: any,
    teritory_id: any,
    ADDRESS_ID: any,
    TYPE: any,
    unit_id: any,
    quentity_per_unit: any,
    unit_name: any
  ): Observable<any> {
    var data = {
      CUSTOMER_ID: customer_id,
      INVENTORY_ID: inventoryId,
      QUANTITY: quantity,
      IS_TEMP_CART: IS_TEMP_CART,
      STATE_ID: STATE_ID,
      TERITORY_ID: teritory_id,
      ADDRESS_ID: ADDRESS_ID,
      TYPE: TYPE,
      UNIT_ID: unit_id,
      QUANTITY_PER_UNIT: quentity_per_unit,
      UNIT_NAME: unit_name,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/add',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getAddress(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + ' AND STATUS = 1 ',
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || this.cookie.get('token'),
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customerAddress/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getAddressDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    CART_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CART_ID: CART_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/getDetails',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  Getterritory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/territory/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getAllServiceData(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = ''
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}api/service/get`,
      requestData,
      {
        headers,
      }
    );
  }
  getCoupanDetails(
    CUSTOMER_ID: number,
    CART_ID: number,
    COUNTRY_ID: any,
    TYPE: any,
    TERRITORY_ID: any
  ): Observable<any> {
    var data = {
      CUSTOMER_ID: CUSTOMER_ID,
      CART_ID: CART_ID,
      COUNTRY_ID: COUNTRY_ID,
      TYPE: TYPE,
      TERRITORY_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/coupons/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getcustomer(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customer/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  ApplyCoupan(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/cart/coupon/apply',
      JSON.stringify(data),
      { headers }
    );
  }
  RemoveCoupan(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/cart/coupon/remove',
      JSON.stringify(data),
      { headers }
    );
  }
  BookOrder(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/cart/updateDetails',
      JSON.stringify(data),
      { headers }
    );
  }
  orderUpdateStatus(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.patch<any>(
      this.url + 'api/order/orderUpdateStatus',
      data,
      { headers }
    );
  }
  RemoveFromCart(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/cart/service/delete',
      JSON.stringify(data),
      { headers }
    );
  }
  CreateOrder(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/cart/order/create',
      JSON.stringify(data),
      { headers }
    );
  }
  addPaymentTransactions(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/invoicepaymentdetails/addPaymentTransactions',
      JSON.stringify(data),
      { headers }
    );
  }
  getorderData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/order/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getOrderDetails(CUSTOMER_ID: any, ORDER_ID: any): Observable<any> {
    var data = {
      CUSTOMER_ID: CUSTOMER_ID,
      ORDER_ID: ORDER_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/orderDetails/getOrderDetails',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getorderLogs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: object,
    ORDER_ID: number,
    IS_ORDER_OR_JOB: string
  ): Observable<any> {
    const data = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
      ORDER_ID: Number(ORDER_ID),
      IS_ORDER_OR_JOB,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianActionLogs/getorderLogsforCustomer',
      data,
      { headers }
    );
  }
  getjoborderLogs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: object,
    ORDER_ID: number,
    JOB_CARD_ID: number,
    IS_ORDER_OR_JOB: string
  ): Observable<any> {
    const data = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
      ORDER_ID: Number(ORDER_ID),
      JOB_CARD_ID: Number(JOB_CARD_ID),
      IS_ORDER_OR_JOB,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianActionLogs/getorderLogsforCustomer',
      data,
      { headers }
    );
  }
  getCartDetails(CUSTOMER_ID: number): Observable<any> {
    var data = {
      CUSTOMER_ID: CUSTOMER_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/getDetails',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getCartGetDetails(CART_ID: number): Observable<any> {
    var data = {
      CART_ID: CART_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/getDetails',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  RateUS(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url +
      'api/customertechnicianfeedback/technicianServiceFeedbackByCustomer',
      JSON.stringify(data),
      { headers }
    );
  }
  getcustomerDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + ' AND STATUS = 1 ',
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customerAddress/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getCoupanDetailsforshop(
    CUSTOMER_ID: number,
    CART_ID: number,
    COUNTRY_ID: any,
    TYPE: any
  ): Observable<any> {
    var data = {
      CUSTOMER_ID: CUSTOMER_ID,
      CART_ID: CART_ID,
      COUNTRY_ID: COUNTRY_ID,
      TYPE: TYPE,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/coupons/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  CartGetforaddtocart(
    customer_id: any,
    inventoryId: any,
    quantity: any,
    IS_TEMP_CART: any,
    UNIT_ID: any,
    UNIT_NAME: any,
    QUANTITY_PER_UNIT: any,
    STATE_ID: any,
    teritory_id: any,
    ADDRESS_ID: any,
    TYPE: any
  ): Observable<any> {
    var data = {
      CUSTOMER_ID: customer_id,
      INVENTORY_ID: inventoryId,
      QUANTITY: quantity,
      IS_TEMP_CART: IS_TEMP_CART,
      UNIT_ID: UNIT_ID,
      UNIT_NAME: UNIT_NAME,
      QUANTITY_PER_UNIT: QUANTITY_PER_UNIT,
      STATE_ID: STATE_ID,
      TERITORY_ID: teritory_id,
      ADDRESS_ID: ADDRESS_ID,
      TYPE: TYPE,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/add',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  CartCountUpdate(
    TYPE: any,
    customer_id: any,
    CART_id: any,
    CART_ITEM_ID: any,
    QUANTITY: any,
    INVENTORY_ID: any
  ): Observable<any> {
    var data = {
      TYPE: TYPE,
      CUSTOMER_ID: customer_id,
      CART_ID: CART_id,
      CART_ITEM_ID: CART_ITEM_ID,
      QUANTITY: QUANTITY,
      INVENTORY_ID: INVENTORY_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/product/update',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  Deletecart(
    TYPE: any,
    customer_id: any,
    CART_id: any,
    CART_ITEM_ID: any,
    INVENTORY_ID: any
  ): Observable<any> {
    var data = {
      TYPE: TYPE,
      CUSTOMER_ID: customer_id,
      CART_ID: CART_id,
      CART_ITEM_ID: CART_ITEM_ID,
      INVENTORY_ID: INVENTORY_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/product/delete',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getfetchJobDetailsWithFeedback(
    CUSTOMER_ID: any,
    ORDER_ID: any,
    JOB_CARD_ID: any,
    sortKey: any,
    sortValue: any
  ): Observable<any> {
    const data = {
      CUSTOMER_ID: Number(CUSTOMER_ID),
      ORDER_ID: Number(ORDER_ID),
      JOB_CARD_ID: Number(JOB_CARD_ID),
      sortKey,
      sortValue,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobcard/getjobDetailsWithFeedback',
      JSON.stringify(data),
      { headers }
    );
  }
  getchat(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    this.options = {
      headers: headers,
    };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/orderChat/get',
      JSON.stringify(data),
      this.options
    );
  }
  createchat(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    this.options = {
      headers: headers,
    };
    return this.httpClient.post<any>(
      this.url + 'api/orderChat/create',
      JSON.stringify(role),
      this.options
    );
  }
  getShoporderData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/shopOrder/get',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  getAllTicketGroups(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/ticketGroup/get',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  getshopeOrderData(filter: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.get<any>(
      `${this.url}api/shopOrder/${filter}/orderDetails`,
      {
        observe: 'response',
        headers,
      }
    );
  }
  createRating(
    ShopserviceId: any,
    UserID: any,
    INVENTORY_ID: any,
    RATING: any,
    COMMENTS: any,
    FEEDBACK_DATE_TIME: any
  ): Observable<any> {
    var data = {
      ORDER_ID: ShopserviceId,
      CUSTOMER_ID: UserID,
      INVENTORY_ID: INVENTORY_ID,
      RATING: RATING,
      COMMENTS: COMMENTS,
      FEEDBACK_DATE_TIME: FEEDBACK_DATE_TIME,
      CLIENT_ID: 1,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/customerProductFeedback/addFeedback',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  getFeedbackData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/customerProductFeedback/get',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  fetfedbackURL(
    AWBCODE: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.get<any>(
      this.url + `api/shopOrder/${AWBCODE}/trackThroughAwbCode`,
      { observe: 'response', headers }
    );
  }
  getShoporderStatusData(filter: any): Observable<any> {
    var data = {
      filter: { ORDER_ID: filter },
    };
    filter: {
      ORDER_ID: filter;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/shopOrderActionLog/get',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  getMappingFaqs2(ticketId: number): Observable<any> {
    var data = {
      TICKET_GROUP_ID: ticketId,
      ORG_ID: 1,
      FAQ_TYPE: 'C',
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<Ticketfaqmapping[]>(
      this.url + 'api/ticketFaqMapping/getTicketFaqMapping',
      JSON.stringify(data),
      { headers: headers, observe: 'response' }
    );
  }
  getAllTickets(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/ticket/get',
      JSON.stringify(data),
      { headers: headers, observe: 'response' }
    );
  }
  createTicket(ticket: any): Observable<any> {
    ticket['ORG_ID'] = Number(this.cookie.get('orgId'));
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/ticket/create/',
      JSON.stringify(ticket),
      { headers: headers, observe: 'response' }
    );
  }
  getAllTicketGroupsprevious(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      ID: ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/ticketGroup/getTicketGroups',
      JSON.stringify(data),
      { headers: headers, observe: 'response' }
    );
  }
  onUpload2(folderName: any, selectedFile: any, filename: any) {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: localStorage.getItem('token') || ' ',
    });
    this.options1 = {
      headers: this.httpHeaders1,
    };
    const fd = new FormData();
    fd.append('Image', selectedFile, filename);
    return this.httpClient.post(
      this.commonimgUrl + folderName,
      fd,
      this.options1
    );
  }
  getKnowledgeBaseCategory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    this.options = {
      headers: headers,
    };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'knowledgeBaseCategory/get',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  getKnowledgeBaseSubCategory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    this.options = {
      headers: headers,
    };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'knowledgebaseSubCategory/get',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  getKnowledgeBase(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    this.options = {
      headers: headers,
    };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'knowledgeBase/get',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  CreateshopOrder(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/cart/order/create',
      JSON.stringify(data),
      { headers }
    );
  }
  addPaymentTransactionsshop(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/invoicepaymentdetails/addPaymentTransactions',
      JSON.stringify(data),
      { headers }
    );
  }
  AddUpdatePartRequest(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/inventoryRequest/updateRequestStatus',
      JSON.stringify(data),
      { headers }
    );
  }
  getPartInfoForOrder(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryRequestDetails/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getPaymentSummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryRequestDetails/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  CartslotGet(customer_id: any, teritory_id: any): Observable<any> {
    var data = {
      CUSTOMER_ID: customer_id,
      TERRITORY_ID: teritory_id,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/slots/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  userLogout(USER_ID: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    var data = {
      USER_ID: USER_ID,
    };
    return this.httpClient.post<any[]>(
      this.baseUrl + 'api/customer/logout',
      JSON.stringify(data),
      {
        headers: headers,
        observe: 'response',
      }
    );
  }
  deleteAccount(USER_DATA: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any[]>(
      this.baseUrl + 'api/customer/deleteProfile',
      JSON.stringify(USER_DATA),
      {
        headers: headers,
        observe: 'response',
      }
    );
  }
  getAllticketDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/ticketDetails/get',
      JSON.stringify(data),
      { headers: headers, observe: 'response' }
    );
  }
  AddChat(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/ticketDetails/create',
      JSON.stringify(data),
      { headers }
    );
  }
  updateTicket(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.put<any>(
      this.url + 'api/ticket/update/',
      JSON.stringify(data),
      { headers }
    );
  }
  getAddressDetailsForshopcart(CART_ID: any): Observable<any> {
    var data = {
      CUSTOMER_ID: CART_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/getDetails',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getDefaultAddress(filter: string): Observable<any> {
    var data = {
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customerAddress/updateAddressDefault',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getglobalServiceData(
    pageIndex: number,
    pageSize: number,
    sortKey: string = '',
    sortValue: string = '',
    filter: string = '',
    CUSTOMER_TYPE: any,
    CUSTOMER_ID: any,
    TERRITORY_ID: any
  ): Observable<any> {
    const requestData = {
      pageIndex,
      pageSize,
      sortKey,
      sortValue,
      filter,
      TYPE: 'M',
      CUSTOMER_TYPE: this.getCustomerType(),
      CUSTOMER_ID: CUSTOMER_ID,
      TERRITORY_ID: TERRITORY_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      `${this.baseUrl}app/global/webSearch`,
      requestData,
      {
        headers,
      }
    );
  }
  getnotifications(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    this.options = {
      headers: headers,
    };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/notification/get',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  getAppLanguageDataFilterwise(
    movementRequestMasterId: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.get<any[]>(
      `${this.url}api/appLanguage/${movementRequestMasterId}/getAppLanguageMaster`,
      { headers: headers, observe: 'response' }
    );
  }
  CartCountUpdateService(
    TYPE: any,
    customer_id: any,
    CART_id: any,
    CART_ITEM_ID: any,
    QUANTITY: any,
    SERVICE_ID: any
  ): Observable<any> {
    var data = {
      TYPE: TYPE,
      CUSTOMER_ID: customer_id,
      CART_ID: CART_id,
      CART_ITEM_ID: CART_ITEM_ID,
      QUANTITY: QUANTITY,
      SERVICE_ID: SERVICE_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/product/update',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getcartinfo(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    USER_ID: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    this.options = {
      headers: headers,
    };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CUSTOMER_ID: USER_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/getDetails',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getinventoryDatacart(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    userId: any,
    id: any,
    qUANTITY_PER_UNIT: any,
    uNIT_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CUSTOMER_ID: userId,
      INVENTORY_ID: id,
      QUANTITY_PER_UNIT: qUANTITY_PER_UNIT,
      UNIT_ID: uNIT_ID,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'inventory/getForCart',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getchnageUnitcount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    unit_id: any,
    item_id: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      UNIT_ID: unit_id,
      ITEM_ID: item_id,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryReports/getStocksforWeb',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getsimpleinventoryforcart(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    userId: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CUSTOMER_ID: userId,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'inventory/getForCart',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getCancellationReason(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cancleOrderReason/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  addOrderCancellationTransaction(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/ordercancellationtransactions/create',
      JSON.stringify(data),
      { headers }
    );
  }
  getinventoryData1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    userId: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CUSTOMER_ID: userId,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'inventory/getForCart',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  getAddressDetails123(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    CART_ID: any,
    IS_CART_PAGE: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CART_ID: CART_ID,
      IS_CART_PAGE: IS_CART_PAGE
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cart/getDetails',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  downloadFile(url: string): Observable<Blob> {
    const fullUrl = `${this.baseUrl}api/getFile/${url}`;
    return this.httpClient.get<Blob>(fullUrl, {
      ...this.options,
      responseType: 'blob' as 'json',
    });
  }
  createChannels(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/channelSubscribedUsers/subscribeToChanel',
      JSON.stringify(form),
      { headers: headers, observe: 'response' }
    );
  }
  updateChannels(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/channelSubscribedUsers/updateSubscribedChannel',
      JSON.stringify(form),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  subscribeToMultipleTopics(topics: string[], explicitToken?: string): Observable<any> {
    let fcmToken = this.cookie.get('CLOUD_ID');
    if (!fcmToken) {
      fcmToken = 'G-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    const token = explicitToken || localStorage.getItem('token') || ' ';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: token,
      'Authorization': `Bearer ${token}`
    });
    console.log('ApiService: Subscribing to topics with token:', token.substring(0, 10) + '...');
    return this.httpClient.post<any>(
      this.url + 'api/notification/subscribeMultiple',
      { token: fcmToken, topics },
      { headers }
    );
  }
  NonSubscribedChannels(
    data: any
  ): Observable<any> {
    var datas = {
      filter: data
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/channelSubscribedUsers/get',
      datas,
      { headers, observe: 'response' }
    );
  }
  unsubscribeToMultipleTopics(topics: string[]): Observable<any> {
    const fcmToken = this.cookie.get('CLOUD_ID');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/notification/unsubscribeMultiple',
      { token: fcmToken, topics },
      { headers, observe: 'response' }
    ).pipe(
      tap(response => console.log('API Response:', response)),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => new Error(error));
      })
    );
  }
  getInvoice(
    filter: any,
  ): Observable<any> {
    var data = {
      filter: filter,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'api/invoice/get',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }
  addShopOrderCancellationTransaction(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/shopOrdercancellationtransactions/create',
      JSON.stringify(data),
      { headers }
    );
  }
  private modalElementId = 'imageModal';
  private imgSrc = '';
  openModal(imgUrl: string) {
    this.imgSrc = imgUrl;
    setTimeout(() => {
      const modalElement = document.getElementById(this.modalElementId);
      if (modalElement) {
        new bootstrap.Modal(modalElement).show();
      }
    }, 100);
  }
  getImageSrc(): string {
    return this.imgSrc;
  }
  isServiceDisabled(): boolean {
    const pincodeFor = localStorage.getItem('pincodeFor');
    return pincodeFor !== 'S';
  }
  isShopDisabled(): boolean {
    const pincodeFor = localStorage.getItem('pincodeFor');
    return pincodeFor !== 'I';
  }
  isFeatureDisabled(feature: 'service' | 'shop'): boolean {
    const pincodeFor = localStorage.getItem('pincodeFor');
    if (feature === 'service') {
      return pincodeFor !== 'S';
    }
    if (feature === 'shop') {
      return pincodeFor !== 'I';
    }
    return true;
  }
  createRazorpayOrdertoRzp(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/paymentGatewayTransactions/createOrder',
      JSON.stringify(data),
      { headers }
    );
  }
  getholidays(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    this.options = {
      headers: headers,
    };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/territoryHolidayMapping/get',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
  addressSubject = new BehaviorSubject<string | null>(null);
  setAddress(value: string) {
    this.addressSubject.next(value);
  }
  getAddressObservable() {
    return this.addressSubject.asObservable();
  }
  checkconflictsMob(
    TYPE_VALUE: any,
  ): Observable<any> {
    var data = {
      TYPE_VALUE: TYPE_VALUE,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.baseUrl + 'customer/getconfiltcsCustomers',
      JSON.stringify(data),
      {
        headers,
      }
    );
  }

  getPendingRating(
    CUSTOMER_ID: any
  ): Observable<any> {
    var data = {
      CUSTOMER_ID
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/customerServiceFeedback/checklatestfeedback', data,
      { observe: 'response', headers }
    );
  }
  creatependingRating(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url +
      'api/customertechnicianfeedback/technicianServiceFeedbackByCustomer',
      JSON.stringify(data),
      { headers }
    );
  }
  getCustomerWallet(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/customerWallet/get',
      JSON.stringify(data),
      { headers }
    );
  }
  getCustomerWalletTransaction(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      applicationkey: this.commonFunction.encryptdatas(this.commonapplicationkey),
      apikey: this.commonFunction.encryptdatas(this.commonapikey),
      token: localStorage.getItem('token') || ' ',
    });
    return this.httpClient.post<any>(
      this.url + 'api/customerWallet/getCustomerWalletTransaction',
      JSON.stringify(data),
      { headers }
    );
  }
}
