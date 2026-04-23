export interface User {
  id: number;
  name: string;
  mobileNumber: string;
  email: string;
  customerType: string;
  token: string;
  subscribedChannels: any[];
}

export interface UserState {
  user: User | null;
  isLogged: boolean;
}

export const initialUserState: UserState = {
  user: null,
  isLogged: false,
};

export const USER_FEATURE_KEY = 'user';
