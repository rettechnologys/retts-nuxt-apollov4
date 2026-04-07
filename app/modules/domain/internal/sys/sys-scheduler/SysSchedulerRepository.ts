import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import {
  IDataPaginationResponse,
  INonDataResponse,
} from '@/utils/types/ResponseInternal';
import {
  CSysSchedulerReqBody,
  DManySysSchedulerReqBody,
  SysSchedulerEntity,
  USysSchedulerReqBody,
} from './SysSchedulerEntity';

export interface SysSchedulerRepository {
  removeManys(
    reqBody: DManySysSchedulerReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  removeOnes(uuid: string): Promise<Either<IFailure, INonDataResponse>>;
  findManys(): Promise<Either<IFailure, SysSchedulerEntity[]>>;
  findOnes(uuid: string): Promise<Either<IFailure, SysSchedulerEntity>>;
  resetAll(): Promise<Either<IFailure, INonDataResponse>>;
  findOnesActive(uuid: string): Promise<Either<IFailure, SysSchedulerEntity>>;
  findManysActive(): Promise<Either<IFailure, SysSchedulerEntity[]>>;
  runManual(uuid: string): Promise<Either<IFailure, INonDataResponse>>;
  updateOnes(
    uuid: string,
    reqBody: USysSchedulerReqBody,
  ): Promise<Either<IFailure, SysSchedulerEntity>>;
  createOnes(
    reqBody: CSysSchedulerReqBody,
  ): Promise<Either<IFailure, SysSchedulerEntity>>;
}
