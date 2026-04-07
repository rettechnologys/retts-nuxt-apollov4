import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import {
  IDataPaginationResponse,
  INonDataResponse,
} from '@/utils/types/ResponseInternal';
import {
  CManySysUserReqBody,
  CSysUserReqBody,
  DManySysUserReqBody,
  SysUserEntity,
  UManySysUserReqBody,
  URManySysUserReqBody,
  USysUserReqBody,
} from './SysUserEntity';
import { RequestParams } from '~/modules/data/internal/data-source/http-client';

export interface SysUserRepository {
  removeManys(
    reqBody: DManySysUserReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  removeOnes(uuid: string): Promise<Either<IFailure, SysUserEntity>>;
  findManys(
    query?: IReqQuery,
  ): Promise<Either<IFailure, IDataPaginationResponse<SysUserEntity[]>>>;
  findOnes(
    uuid: string,
    query?: IReqQuery,
  ): Promise<Either<IFailure, SysUserEntity>>;
  updateManys(
    reqBody: UManySysUserReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  updateOnes(
    uuid: string,
    reqBody: USysUserReqBody,
    axiosConfig?: RequestParams,
  ): Promise<Either<IFailure, SysUserEntity>>;
  recoverOnes(uuid: string): Promise<Either<IFailure, SysUserEntity>>;
  createOnes(
    reqBody: CSysUserReqBody,
    axiosConfig?: RequestParams,
  ): Promise<Either<IFailure, SysUserEntity>>;
  createManys(
    reqBody: CManySysUserReqBody,
  ): Promise<Either<IFailure, SysUserEntity[]>>;
  replaceManys(
    reqBody: URManySysUserReqBody,
  ): Promise<Either<IFailure, SysUserEntity[]>>;
  replaceOnes(
    uuid: string,
    reqBody: USysUserReqBody,
  ): Promise<Either<IFailure, SysUserEntity>>;
}
