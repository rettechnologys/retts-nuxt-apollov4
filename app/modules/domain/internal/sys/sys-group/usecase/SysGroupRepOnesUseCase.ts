import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidBody } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import { SysGroupEntity, USysGroupReqBody } from '../SysGroupEntity';
import type { SysGroupRepository } from '../SysGroupRepository';

@singleton()
export class SysGroupRepOnesUseCase
  implements UseCase<SysGroupEntity, IReqUidBody<USysGroupReqBody>>
{
  private sysGroupRepository: SysGroupRepository;

  constructor(
    @inject('SysGroupRepository') sysGroupRepository: SysGroupRepository,
  ) {
    this.sysGroupRepository = sysGroupRepository;
  }

  call(
    reqUidBody: IReqUidBody<USysGroupReqBody>,
  ): Promise<Either<IFailure, SysGroupEntity>> {
    return this.sysGroupRepository.replaceOnes(
      reqUidBody.uid.toString(),
      reqUidBody.reqBody,
    );
  }
}
