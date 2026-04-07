import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidQuery } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import { SysUserEntity } from '../SysUserEntity';
import type { SysUserRepository } from '../SysUserRepository';

@singleton()
export class SysUserFOnesUseCase
  implements UseCase<SysUserEntity, IReqUidQuery>
{
  private sysUserRepository: SysUserRepository;

  constructor(
    @inject('SysUserRepository') sysUserRepository: SysUserRepository,
  ) {
    this.sysUserRepository = sysUserRepository;
  }

  call(reqUidQuery: IReqUidQuery): Promise<Either<IFailure, SysUserEntity>> {
    return this.sysUserRepository.findOnes(
      reqUidQuery.uid.toString(),
      reqUidQuery.query,
    );
  }
}
