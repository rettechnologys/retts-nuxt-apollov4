import type { IReqUidBodyQuery } from './RequestInternal';
import type { IPagination } from './ResponseInternal';

export const COMMON_STATE = 'Common';

export enum ECommonNameState {
  COnes = 'CreateOnes',
  CManys = 'CreateManys',
  FManys = 'FindManys',
  FOnes = 'FindOnes',
  RecOnes = 'RecoverOnes',
  RemManys = 'RemoveManys',
  RemOnes = 'RemoveOnes',
  RepManys = 'ReplaceManys',
  RepOnes = 'ReplaceOnes',
  UManys = 'UpdateManys',
  UOnes = 'UpdateOnes',
  UPManys = 'UploadeManys',
  UPOnes = 'UploadOnes',
}

export enum ECommonStatusState {
  Initial = 'Initial',
  FetchWaiting = 'FetchWaiting',
  FetchSuccess = 'FetchSuccess',
  FetchFailure = 'FetchFailure',
  SaveWaiting = 'SaveWaiting',
  SaveSuccess = 'SaveSuccess',
  SaveFailure = 'SaveFailure',
  RemoveWaiting = 'RemoveWaiting',
  RemoveSuccess = 'RemoveSuccess',
  RemoveFailure = 'RemoveFailure',
  CreateWaiting = 'CreateWaiting',
  CreateSuccess = 'CreateSuccess',
  CreateFailure = 'CreateFailure',
  UpdateWaiting = 'UpdateWaiting',
  UpdateSuccess = 'UpdateSuccess',
  UpdateFailure = 'UpdateFailure',
  ReplaceWaiting = 'ReplaceWaiting',
  ReplaceSuccess = 'ReplaceSuccess',
  ReplaceFailure = 'ReplaceFailure',
  RecoverWaiting = 'RecoverWaiting',
  RecoverSuccess = 'RecoverSuccess',
  RecoverFailure = 'RecoverFailure',
  UploadWaiting = 'UploadWaiting',
  UploadSuccess = 'UploadSuccess',
  UploadFailure = 'UploadFailure',
}

export interface ICommonState {
  status: ECommonStatusState | any;
  name: string;
  methodName?: string;
  data?: any;
  pagination?: IPagination;
  successMessage?: string;
  failureCode?: number;
  failureMessage?: string | string[];
  reqData?: IReqUidBodyQuery;
}

export const commonInitialState: ICommonState = {
  status: ECommonStatusState.Initial,
  name: `${COMMON_STATE}${ECommonStatusState.Initial}`,
};
