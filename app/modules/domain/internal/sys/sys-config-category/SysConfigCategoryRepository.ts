import { Either } from '~/utils/helpers/Either';
import {
  CSysConfigCategoryReqBody,
  DManySysConfigCategoryReqBody,
  SysConfigCategoryEntity,
  USysConfigCategoryReqBody,
} from './SysConfigCategoryEntity';
import { IFailure } from '@/utils/types/Failure';
import {
  IDataPaginationResponse,
  INonDataResponse,
} from '@/utils/types/ResponseInternal';
import { IReqQuery } from '@/utils/types/RequestInternal';

export interface SysConfigCategoryRepository {
  removeManys(
    reqBody: DManySysConfigCategoryReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  removeOnes(uuid: string): Promise<Either<IFailure, SysConfigCategoryEntity>>;
  findManys(
    query?: IReqQuery,
  ): Promise<
    Either<IFailure, IDataPaginationResponse<SysConfigCategoryEntity[]>>
  >;
  findOnes(
    uuid: string,
    query?: IReqQuery,
  ): Promise<Either<IFailure, SysConfigCategoryEntity>>;

  updateOnes(
    uuid: string,
    reqBody: USysConfigCategoryReqBody,
  ): Promise<Either<IFailure, SysConfigCategoryEntity>>;
  recoverOnes(uuid: string): Promise<Either<IFailure, SysConfigCategoryEntity>>;
  createOnes(
    reqBody: CSysConfigCategoryReqBody,
  ): Promise<Either<IFailure, SysConfigCategoryEntity>>;

  replaceOnes(
    uuid: string,
    reqBody: USysConfigCategoryReqBody,
  ): Promise<Either<IFailure, SysConfigCategoryEntity>>;
}
