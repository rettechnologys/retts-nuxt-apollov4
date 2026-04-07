import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { DManySysUserReqBody } from '../SysUserEntity';
import type { SysUserRepository } from '../SysUserRepository';

@singleton()
export class SysUserRemManysUseCase
  implements UseCase<INonDataResponse, DManySysUserReqBody>
{
  private sysUserRepository: SysUserRepository;

  constructor(
    @inject('SysUserRepository') sysUserRepository: SysUserRepository,
  ) {
    this.sysUserRepository = sysUserRepository;
  }

  call(
    reqBody: DManySysUserReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysUserRepository.removeManys(reqBody);
  }
}
