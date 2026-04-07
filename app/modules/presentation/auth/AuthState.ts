import { ECommonStatusState, ICommonState } from '@/utils/types/CommonState';

export const AUTH_STATE = 'Auth' as const;

export enum EAuthNameState {
  Login = 'Login',
  Logout = 'Logout',
  ForgotPassword = 'Forgot',
  LoginAzure = 'LoginAzure',
}

export const EAuthStatusState = ECommonStatusState;

export type AuthState = ICommonState;

export const initialState: AuthState = {
  status: EAuthStatusState.Initial,
  name: `${AUTH_STATE}${EAuthStatusState.Initial}`,
};
