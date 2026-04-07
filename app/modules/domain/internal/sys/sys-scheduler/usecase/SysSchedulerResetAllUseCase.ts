import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INoParam } from '@/utils/types/NoParam';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import type { SysSchedulerRepository } from '../SysSchedulerRepository';

@singleton()
export class SysSchedulerResetAllUseCase
  implements UseCase<INonDataResponse, INoParam>
{
  private sysSchedulerRepository: SysSchedulerRepository;

  constructor(
    @inject('SysSchedulerRepository')
    sysSchedulerRepository: SysSchedulerRepository,
  ) {
    this.sysSchedulerRepository = sysSchedulerRepository;
  }

  call(): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysSchedulerRepository.resetAll();
  }
}
