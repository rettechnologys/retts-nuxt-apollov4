import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { CManySysUserReqBody, SysUserEntity } from '../SysUserEntity';
import type { SysUserRepository } from '../SysUserRepository';

@singleton()
export class SysUserCManysUseCase
  implements UseCase<SysUserEntity[], CManySysUserReqBody>
{
  private sysUserRepository: SysUserRepository;

  constructor(
    @inject('SysUserRepository') sysUserRepository: SysUserRepository,
  ) {
    this.sysUserRepository = sysUserRepository;
  }

  call(
    reqBody: CManySysUserReqBody,
  ): Promise<Either<IFailure, SysUserEntity[]>> {
    return this.sysUserRepository.createManys(reqBody);
  }
}
