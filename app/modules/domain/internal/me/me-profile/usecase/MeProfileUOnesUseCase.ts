import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysUserEntity, USysUserReqBody } from '../../../sys/sys-user';
import type { MeProfileRepository } from '../MeProfileRepository';

@singleton()
export class MeProfileUOnesUseCase
  implements UseCase<SysUserEntity, USysUserReqBody>
{
  private meProfileRepository: MeProfileRepository;

  constructor(
    @inject('MeProfileRepository') meProfileRepository: MeProfileRepository,
  ) {
    this.meProfileRepository = meProfileRepository;
  }

  call(
    reqBody: USysUserReqBody,
    axiosConfig?: any,
  ): Promise<Either<IFailure, SysUserEntity>> {
    return this.meProfileRepository.updateOnes(reqBody, axiosConfig);
  }
}
