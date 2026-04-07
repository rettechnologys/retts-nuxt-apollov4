import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import {
  CSysMenuReqBody,
  SysMenuEntity,
  URManySysMenuReqBody,
  USysMenuReqBody,
} from './SysMenuEntity';
import { INonDataResponse } from '@/utils/types/ResponseInternal';

export interface SysMenuRepository {
  removeOnes(uuid: string): Promise<Either<IFailure, INonDataResponse>>;
  findManys(): Promise<Either<IFailure, SysMenuEntity[]>>;
  findOnes(uuid: string): Promise<Either<IFailure, SysMenuEntity>>;
  findOnesTree(uuid: string): Promise<Either<IFailure, SysMenuEntity>>;
  updateOnes(
    uuid: string,
    reqBody: USysMenuReqBody,
  ): Promise<Either<IFailure, SysMenuEntity>>;
  createOnes(
    reqBody: CSysMenuReqBody,
  ): Promise<Either<IFailure, SysMenuEntity>>;
  replaceManys(
    reqBody: URManySysMenuReqBody,
  ): Promise<Either<IFailure, SysMenuEntity[]>>;
}
