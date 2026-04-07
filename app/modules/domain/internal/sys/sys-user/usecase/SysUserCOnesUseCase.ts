import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { CSysUserReqBody, SysUserEntity } from '../SysUserEntity';
import type { SysUserRepository } from '../SysUserRepository';
import { RequestParams } from '~/modules/data/internal/data-source/http-client';

@singleton()
export class SysUserCOnesUseCase
  implements UseCase<SysUserEntity, CSysUserReqBody>
{
  private sysUserRepository: SysUserRepository;

  constructor(
    @inject('SysUserRepository') sysUserRepository: SysUserRepository,
  ) {
    this.sysUserRepository = sysUserRepository;
  }

  call(
    reqBody: CSysUserReqBody,
    axiosConfig?: RequestParams,
  ): Promise<Either<IFailure, SysUserEntity>> {
    return this.sysUserRepository.createOnes(reqBody, axiosConfig);
  }
}
