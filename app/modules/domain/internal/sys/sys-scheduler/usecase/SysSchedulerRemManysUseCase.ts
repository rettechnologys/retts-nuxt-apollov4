import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { DManySysSchedulerReqBody } from '../SysSchedulerEntity';
import type { SysSchedulerRepository } from '../SysSchedulerRepository';

@singleton()
export class SysSchedulerRemManysUseCase
  implements UseCase<INonDataResponse, DManySysSchedulerReqBody>
{
  private sysSchedulerRepository: SysSchedulerRepository;

  constructor(
    @inject('SysSchedulerRepository')
    sysSchedulerRepository: SysSchedulerRepository,
  ) {
    this.sysSchedulerRepository = sysSchedulerRepository;
  }

  call(
    reqBody: DManySysSchedulerReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysSchedulerRepository.removeManys(reqBody);
  }
}
