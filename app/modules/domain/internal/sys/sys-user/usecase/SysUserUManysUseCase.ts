import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { UManySysUserReqBody } from '../SysUserEntity';
import type { SysUserRepository } from '../SysUserRepository';

@singleton()
export class SysUserUManysUseCase
  implements UseCase<INonDataResponse, UManySysUserReqBody>
{
  private sysUserRepository: SysUserRepository;

  constructor(
    @inject('SysUserRepository') sysUserRepository: SysUserRepository,
  ) {
    this.sysUserRepository = sysUserRepository;
  }

  call(
    reqBody: UManySysUserReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysUserRepository.updateManys(reqBody);
  }
}
