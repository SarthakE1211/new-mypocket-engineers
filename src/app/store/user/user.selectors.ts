import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState, USER_FEATURE_KEY } from './user.state';

export const selectUserState = createFeatureSelector<UserState>(USER_FEATURE_KEY);

export const selectUser = createSelector(selectUserState, (s) => s.user);
export const selectIsLogged = createSelector(selectUserState, (s) => s.isLogged);
export const selectUserId = createSelector(selectUser, (u) => u?.id ?? null);
export const selectUserName = createSelector(selectUser, (u) => u?.name ?? '');
export const selectUserEmail = createSelector(selectUser, (u) => u?.email ?? '');
export const selectUserMobile = createSelector(selectUser, (u) => u?.mobileNumber ?? '');
export const selectCustomerType = createSelector(selectUser, (u) => u?.customerType ?? '');
export const selectUserToken = createSelector(selectUser, (u) => u?.token ?? '');
export const selectSubscribedChannels = createSelector(selectUser, (u) => u?.subscribedChannels ?? []);
