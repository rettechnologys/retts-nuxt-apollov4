import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import {
  IDataPaginationResponse,
  INonDataResponse,
} from '@/utils/types/ResponseInternal';
import {
  CSysNotifManualReqBody,
  DManySysNotifManualReqBody,
  SysNotifManualEntity,
} from './SysNotifManualEntity';
import { RequestParams } from '~/modules/data/internal/data-source/http-client';

export interface SysNotifManualRepository {
  removeManys(
    reqBody: DManySysNotifManualReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  removeOnes(uuid: string): Promise<Either<IFailure, INonDataResponse>>;
  findManys(
    query?: IReqQuery,
  ): Promise<Either<IFailure, IDataPaginationResponse<SysNotifManualEntity[]>>>;
  findOnes(
    uuid: string,
    query?: IReqQuery,
  ): Promise<Either<IFailure, SysNotifManualEntity>>;
  createOnes(
    reqBody: CSysNotifManualReqBody,
    axiosConfig?: RequestParams,
  ): Promise<Either<IFailure, SysNotifManualEntity>>;
}
