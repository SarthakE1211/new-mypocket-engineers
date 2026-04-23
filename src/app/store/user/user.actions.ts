import { createAction, props } from '@ngrx/store';
import { User } from './user.state';

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const hydrateUserFromStorage = createAction(
  '[App Init] Hydrate User From Storage'
);

export const userHydrated = createAction(
  '[App Init] User Hydrated',
  props<{ user: User | null }>()
);

export const logout = createAction('[Auth] Logout');
