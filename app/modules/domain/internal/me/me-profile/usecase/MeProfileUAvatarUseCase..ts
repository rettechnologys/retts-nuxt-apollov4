import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqSingleFile } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import { SysUserEntity } from '../../../sys/sys-user';
import type { MeProfileRepository } from '../MeProfileRepository';

@singleton()
export class MeProfileUAvatarUseCase
  implements UseCase<SysUserEntity, IReqSingleFile>
{
  private meProfileRepository: MeProfileRepository;

  constructor(
    @inject('MeProfileRepository') meProfileRepository: MeProfileRepository,
  ) {
    this.meProfileRepository = meProfileRepository;
  }

  call(
    reqBody: IReqSingleFile,
    axiosConfig?: any,
  ): Promise<Either<IFailure, SysUserEntity>> {
    return this.meProfileRepository.updateOnes(reqBody, axiosConfig);
  }
}
