import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalSubject = new BehaviorSubject<boolean>(false);
  modalState$ = this.modalSubject.asObservable();
  private toggleSubject = new BehaviorSubject<boolean>(false);
  toggleState$ = this.toggleSubject.asObservable();
  private drawerSubject = new BehaviorSubject<{isOpen: boolean, payload: any}>({ isOpen: false, payload: null });
  drawerState$ = this.drawerSubject.asObservable();
  private triggerFunctionSubject = new Subject<void>();  
  triggerFunction$ = this.triggerFunctionSubject.asObservable();
  private addressUpdatedSource = new Subject<void>();
  addressUpdated$ = this.addressUpdatedSource.asObservable();
  notifyAddressUpdated() {
    this.addressUpdatedSource.next();
  }
  triggerFunction() {
    this.triggerFunctionSubject.next();  
  }
  openModal() {
    this.modalSubject.next(true);
  }
  closeModal() {
    this.modalSubject.next(false);
  }
  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();
  updateUserData(data: any) {
    this.userDataSubject.next(data);
  }
  toggle() {
    this.toggleSubject.next(!this.toggleSubject.value);
  }
  setToggleState(state: boolean) {
    this.toggleSubject.next(state);
  }
  toggleDrawer(payload: any = null) {
    const currentState = this.drawerSubject.value.isOpen;
    this.drawerSubject.next({ isOpen: !currentState, payload });  
  }
  setDrawerState(isOpen: boolean, payload: any = null) {
    this.drawerSubject.next({ isOpen, payload });  
  }
}