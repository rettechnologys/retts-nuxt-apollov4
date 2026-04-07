import { Either } from '~/utils/helpers/Either';
import {
  CSysNotifCategoryReqBody,
  DManySysNotifCategoryReqBody,
  SysNotifCategoryEntity,
  USysNotifCategoryReqBody,
} from './SysNotifCategoryEntity';
import { IFailure } from '@/utils/types/Failure';
import {
  IDataPaginationResponse,
  INonDataResponse,
} from '@/utils/types/ResponseInternal';
import { IReqQuery } from '@/utils/types/RequestInternal';

export interface SysNotifCategoryRepository {
  removeManys(
    reqBody: DManySysNotifCategoryReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  removeOnes(uuid: string): Promise<Either<IFailure, SysNotifCategoryEntity>>;
  findManys(
    query?: IReqQuery,
  ): Promise<
    Either<IFailure, IDataPaginationResponse<SysNotifCategoryEntity[]>>
  >;
  findOnes(
    uuid: string,
    query?: IReqQuery,
  ): Promise<Either<IFailure, SysNotifCategoryEntity>>;
  updateOnes(
    uuid: string,
    reqBody: USysNotifCategoryReqBody,
  ): Promise<Either<IFailure, SysNotifCategoryEntity>>;
  recoverOnes(uuid: string): Promise<Either<IFailure, SysNotifCategoryEntity>>;
  createOnes(
    reqBody: CSysNotifCategoryReqBody,
  ): Promise<Either<IFailure, SysNotifCategoryEntity>>;
}
