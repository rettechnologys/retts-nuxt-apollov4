import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysUserEntity } from '../SysUserEntity';
import type { SysUserRepository } from '../SysUserRepository';

@singleton()
export class SysUserRecOnesUseCase implements UseCase<SysUserEntity, string> {
  private sysUserRepository: SysUserRepository;

  constructor(
    @inject('SysUserRepository') sysUserRepository: SysUserRepository,
  ) {
    this.sysUserRepository = sysUserRepository;
  }

  call(uuid: string): Promise<Either<IFailure, SysUserEntity>> {
    return this.sysUserRepository.recoverOnes(uuid);
  }
}
