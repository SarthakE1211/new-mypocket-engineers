import { createReducer, on } from '@ngrx/store';
import { initialUserState } from './user.state';
import { loginSuccess, logout, userHydrated } from './user.actions';

export const userReducer = createReducer(
  initialUserState,
  on(loginSuccess, (_state, { user }) => ({ user, isLogged: true })),
  on(userHydrated, (_state, { user }) => ({ user, isLogged: !!user })),
  on(logout, () => ({ user: null, isLogged: false }))
);
