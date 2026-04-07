import {
  ECommonNameState,
  ECommonStatusState,
  ICommonState,
} from '@/utils/types/CommonState';

export const ME_PROFILE_STATE = 'MeProfile' as const;

export const EMeProfileNameState = ECommonNameState;

export const EMeProfileStatusState = ECommonStatusState;

export type MeProfileState = ICommonState;

export const initialState: MeProfileState = {
  status: EMeProfileStatusState.Initial,
  name: `${ME_PROFILE_STATE}${EMeProfileStatusState.Initial}`,
};
