import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidBody } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import {
  SysSchedulerEntity,
  USysSchedulerReqBody,
} from '../SysSchedulerEntity';
import type { SysSchedulerRepository } from '../SysSchedulerRepository';

@singleton()
export class SysSchedulerUOnesUseCase
  implements UseCase<SysSchedulerEntity, IReqUidBody<USysSchedulerReqBody>>
{
  private sysSchedulerRepository: SysSchedulerRepository;

  constructor(
    @inject('SysSchedulerRepository')
    sysSchedulerRepository: SysSchedulerRepository,
  ) {
    this.sysSchedulerRepository = sysSchedulerRepository;
  }

  call(
    reqUidBody: IReqUidBody<USysSchedulerReqBody>,
  ): Promise<Either<IFailure, SysSchedulerEntity>> {
    return this.sysSchedulerRepository.updateOnes(
      reqUidBody.uid.toString(),
      reqUidBody.reqBody,
    );
  }
}
