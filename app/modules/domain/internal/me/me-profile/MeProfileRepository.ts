import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import { SysUserEntity, USysUserReqBody } from '../../sys/sys-user';

export interface MeProfileRepository {
  updateOnes(
    reqBody: USysUserReqBody,
    axiosConfig?: any,
  ): Promise<Either<IFailure, SysUserEntity>>;
  updateAvatar(
    reqBody: USysUserReqBody,
    axiosConfig?: any,
  ): Promise<Either<IFailure, SysUserEntity>>;
}
