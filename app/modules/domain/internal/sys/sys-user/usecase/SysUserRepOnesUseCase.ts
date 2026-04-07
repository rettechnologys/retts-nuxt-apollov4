import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidBody } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import { SysUserEntity, USysUserReqBody } from '../SysUserEntity';
import type { SysUserRepository } from '../SysUserRepository';

@singleton()
export class SysUserRepOnesUseCase
  implements UseCase<SysUserEntity, IReqUidBody<USysUserReqBody>>
{
  private sysUserRepository: SysUserRepository;

  constructor(
    @inject('SysUserRepository') sysUserRepository: SysUserRepository,
  ) {
    this.sysUserRepository = sysUserRepository;
  }

  call(
    reqUidBody: IReqUidBody<USysUserReqBody>,
  ): Promise<Either<IFailure, SysUserEntity>> {
    return this.sysUserRepository.replaceOnes(
      reqUidBody.uid.toString(),
      reqUidBody.reqBody,
    );
  }
}
