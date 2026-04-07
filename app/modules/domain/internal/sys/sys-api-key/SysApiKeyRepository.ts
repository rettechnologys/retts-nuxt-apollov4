import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import {
  IDataPaginationResponse,
  INonDataResponse,
} from '@/utils/types/ResponseInternal';
import {
  CManySysApiKeyReqBody,
  CSysApiKeyReqBody,
  DManySysApiKeyReqBody,
  SysApiKeyEntity,
  UManySysApiKeyReqBody,
  USysApiKeyReqBody,
} from './SysApiKeyEntity';

export interface SysApiKeyRepository {
  removeManys(
    reqBody: DManySysApiKeyReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  removeOnes(uuid: string): Promise<Either<IFailure, SysApiKeyEntity>>;
  findManys(
    query?: IReqQuery,
  ): Promise<Either<IFailure, IDataPaginationResponse<SysApiKeyEntity[]>>>;
  findOnes(
    uuid: string,
    query?: IReqQuery,
  ): Promise<Either<IFailure, SysApiKeyEntity>>;
  updateManys(
    reqBody: UManySysApiKeyReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  updateOnes(
    uuid: string,
    reqBody: USysApiKeyReqBody,
  ): Promise<Either<IFailure, SysApiKeyEntity>>;
  recoverOnes(uuid: string): Promise<Either<IFailure, SysApiKeyEntity>>;
  createOnes(
    reqBody: CSysApiKeyReqBody,
  ): Promise<Either<IFailure, SysApiKeyEntity>>;
  createManys(
    reqBody: CManySysApiKeyReqBody,
  ): Promise<Either<IFailure, SysApiKeyEntity[]>>;
}
