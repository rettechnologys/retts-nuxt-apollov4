import { ECommonStatusState, ICommonState } from '@/utils/types/CommonState';

export const ME_STATE = 'Me' as const;

export enum EMeNameState {
  Me = 'Me',
}

export const EMeStatusState = ECommonStatusState;

export type MeState = ICommonState;

export const initialState: MeState = {
  status: EMeStatusState.Initial,
  name: `${ME_STATE}${EMeStatusState.Initial}`,
};
