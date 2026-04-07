import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import {
  IDataPaginationResponse,
  INonDataResponse,
} from '@/utils/types/ResponseInternal';
import {
  CManySysGroupReqBody,
  CSysGroupReqBody,
  DManySysGroupReqBody,
  SysGroupEntity,
  UManySysGroupReqBody,
  URManySysGroupReqBody,
  USysGroupReqBody,
} from './SysGroupEntity';
import { SysGroupParentEntity } from './SysGroupParentEntity';

export interface SysGroupRepository {
  removeManys(
    reqBody: DManySysGroupReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  removeOnes(uuid: string): Promise<Either<IFailure, SysGroupEntity>>;
  findManys(
    query?: IReqQuery,
  ): Promise<Either<IFailure, IDataPaginationResponse<SysGroupEntity[]>>>;
  findOnes(
    uuid: string,
    query?: IReqQuery,
  ): Promise<Either<IFailure, SysGroupEntity>>;
  findManysParent(): Promise<Either<IFailure, SysGroupParentEntity[]>>;
  updateManys(
    reqBody: UManySysGroupReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  updateOnes(
    uuid: string,
    reqBody: USysGroupReqBody,
  ): Promise<Either<IFailure, SysGroupEntity>>;
  recoverOnes(uuid: string): Promise<Either<IFailure, SysGroupEntity>>;
  createOnes(
    reqBody: CSysGroupReqBody,
  ): Promise<Either<IFailure, SysGroupEntity>>;
  createManys(
    reqBody: CManySysGroupReqBody,
  ): Promise<Either<IFailure, SysGroupEntity[]>>;
  replaceManys(
    reqBody: URManySysGroupReqBody,
  ): Promise<Either<IFailure, SysGroupEntity[]>>;
  replaceOnes(
    uuid: string,
    reqBody: USysGroupReqBody,
  ): Promise<Either<IFailure, SysGroupEntity>>;
}
