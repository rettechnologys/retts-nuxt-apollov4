import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysUserEntity, URManySysUserReqBody } from '../SysUserEntity';
import type { SysUserRepository } from '../SysUserRepository';

@singleton()
export class SysUserRepManysUseCase
  implements UseCase<SysUserEntity[], URManySysUserReqBody>
{
  private sysUserRepository: SysUserRepository;

  constructor(
    @inject('SysUserRepository') sysUserRepository: SysUserRepository,
  ) {
    this.sysUserRepository = sysUserRepository;
  }

  call(
    reqBody: URManySysUserReqBody,
  ): Promise<Either<IFailure, SysUserEntity[]>> {
    return this.sysUserRepository.replaceManys(reqBody);
  }
}
