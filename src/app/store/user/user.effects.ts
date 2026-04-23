import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { hydrateUserFromStorage, userHydrated } from './user.actions';
import { User } from './user.state';

@Injectable()
export class UserEffects {
  private commonFunction = new CommonFunctionService();

  constructor(private actions$: Actions) {}

  // Reads the encrypted credentials login.component.ts wrote to
  // localStorage/sessionStorage, decrypts them, and pushes a User into the
  // store. Dispatched once on app bootstrap so that after the post-login
  // window.location reload the store is populated before any consumer reads.
  hydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(hydrateUserFromStorage),
      map(() => userHydrated({ user: this.readUserFromStorage() }))
    )
  );

  private readUserFromStorage(): User | null {
    if (localStorage.getItem('isLogged') !== 'true') return null;

    const idStr = this.decryptSession('userId');
    const id = idStr ? parseInt(idStr, 10) : NaN;
    if (!Number.isFinite(id)) return null;

    let subscribedChannels: any[] = [];
    const channelsRaw = this.decryptLocal('subscribedChannels');
    if (channelsRaw) {
      try {
        const parsed = JSON.parse(channelsRaw);
        if (Array.isArray(parsed)) subscribedChannels = parsed;
      } catch {
        // malformed cache — leave empty, do not crash bootstrap
      }
    }

    return {
      id,
      name: this.decryptSession('userName'),
      mobileNumber: this.decryptSession('mobileNumber'),
      email: this.decryptSession('emailId'),
      customerType: this.decryptSession('customertype'),
      token: sessionStorage.getItem('token') || localStorage.getItem('token') || '',
      subscribedChannels,
    };
  }

  private decryptSession(key: string): string {
    const raw = sessionStorage.getItem(key);
    return raw ? this.commonFunction.decryptdata(raw) : '';
  }

  private decryptLocal(key: string): string {
    const raw = localStorage.getItem(key);
    return raw ? this.commonFunction.decryptdata(raw) : '';
  }
}
