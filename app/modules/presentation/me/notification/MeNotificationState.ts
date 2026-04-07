import {
  ECommonNameState,
  ECommonStatusState,
  ICommonState,
} from '@/utils/types/CommonState';

export const ME_NOTIFICATION_STATE = 'MeNotification' as const;

export const EMeNotificationNameState = ECommonNameState;

export const EMeNotificationStatusState = ECommonStatusState;

export type MeNotificationState = ICommonState;

export const initialState: MeNotificationState = {
  status: EMeNotificationStatusState.Initial,
  name: `${ME_NOTIFICATION_STATE}${EMeNotificationStatusState.Initial}`,
};
