import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import {
  IDataPaginationResponse,
  INonDataResponse,
} from '@/utils/types/ResponseInternal';
import {
  CUManySysConfigReqBody,
  CUSysConfigReqBody,
  DManySysConfigReqBody,
  SysConfigEntity,
} from './SysConfigEntity';

export interface SysConfigRepository {
  removeManys(
    reqBody: DManySysConfigReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  removeOnes(keyword: string): Promise<Either<IFailure, INonDataResponse>>;
  findManys(
    query?: IReqQuery,
  ): Promise<Either<IFailure, IDataPaginationResponse<SysConfigEntity[]>>>;
  findOnes(
    keyword: string,
    query?: IReqQuery,
  ): Promise<Either<IFailure, SysConfigEntity>>;
  createUpdateManys(
    reqBody: CUManySysConfigReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  createUpdateOnes(
    reqBody: CUSysConfigReqBody,
  ): Promise<Either<IFailure, SysConfigEntity>>;
}
