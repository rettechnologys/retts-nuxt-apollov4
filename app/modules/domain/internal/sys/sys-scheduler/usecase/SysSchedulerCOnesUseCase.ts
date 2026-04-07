import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import {
  CSysSchedulerReqBody,
  SysSchedulerEntity,
} from '../SysSchedulerEntity';
import type { SysSchedulerRepository } from '../SysSchedulerRepository';

@singleton()
export class SysSchedulerCOnesUseCase
  implements UseCase<SysSchedulerEntity, CSysSchedulerReqBody>
{
  private sysSchedulerRepository: SysSchedulerRepository;

  constructor(
    @inject('SysSchedulerRepository')
    sysSchedulerRepository: SysSchedulerRepository,
  ) {
    this.sysSchedulerRepository = sysSchedulerRepository;
  }

  call(
    reqBody: CSysSchedulerReqBody,
  ): Promise<Either<IFailure, SysSchedulerEntity>> {
    return this.sysSchedulerRepository.createOnes(reqBody);
  }
}
