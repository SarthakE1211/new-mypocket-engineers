import { ActionReducerMap } from '@ngrx/store';
import { userReducer } from './user/user.reducer';
import { UserState, USER_FEATURE_KEY } from './user/user.state';

export interface AppState {
  [USER_FEATURE_KEY]: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  [USER_FEATURE_KEY]: userReducer,
};
