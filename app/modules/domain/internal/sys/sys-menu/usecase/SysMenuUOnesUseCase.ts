import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidBody } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import { SysMenuEntity, USysMenuReqBody } from '../SysMenuEntity';
import type { SysMenuRepository } from '../SysMenuRepository';

@singleton()
export class SysMenuUOnesUseCase
  implements UseCase<SysMenuEntity, IReqUidBody<USysMenuReqBody>>
{
  private sysMenuRepository: SysMenuRepository;

  constructor(
    @inject('SysMenuRepository') sysMenuRepository: SysMenuRepository,
  ) {
    this.sysMenuRepository = sysMenuRepository;
  }

  call(
    reqUidBody: IReqUidBody<USysMenuReqBody>,
  ): Promise<Either<IFailure, SysMenuEntity>> {
    return this.sysMenuRepository.updateOnes(
      reqUidBody.uid.toString(),
      reqUidBody.reqBody,
    );
  }
}
