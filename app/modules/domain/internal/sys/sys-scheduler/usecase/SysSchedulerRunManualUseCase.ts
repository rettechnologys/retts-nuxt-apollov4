import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import type { SysSchedulerRepository } from '../SysSchedulerRepository';

@singleton()
export class SysSchedulerRunManualUseCase
  implements UseCase<INonDataResponse, string>
{
  private sysSchedulerRepository: SysSchedulerRepository;

  constructor(
    @inject('SysSchedulerRepository')
    sysSchedulerRepository: SysSchedulerRepository,
  ) {
    this.sysSchedulerRepository = sysSchedulerRepository;
  }

  call(uuid: string): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysSchedulerRepository.runManual(uuid);
  }
}
