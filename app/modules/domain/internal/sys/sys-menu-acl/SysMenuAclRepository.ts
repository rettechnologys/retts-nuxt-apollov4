import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import {
  SysMenuAclActionsEntity,
  SysMenuAclEntity,
  SysMenuAclSimpleEntity,
  USysMenuAclReqBody,
} from './SysMenuAclEntity';

export interface SysMenuAclRepository {
  findManys(sysGroupId: number): Promise<Either<IFailure, SysMenuAclEntity[]>>;
  findManysActions(
    sysGroupId: number,
    sysMenuId: number,
  ): Promise<Either<IFailure, SysMenuAclActionsEntity[]>>;
  updateOnes(
    sysGroupId: number,
    sysMenuId: number,
    reqBody: USysMenuAclReqBody,
  ): Promise<Either<IFailure, SysMenuAclSimpleEntity>>;
}
