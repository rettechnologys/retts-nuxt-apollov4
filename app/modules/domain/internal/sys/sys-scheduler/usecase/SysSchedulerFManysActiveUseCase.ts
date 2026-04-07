import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INoParam } from '@/utils/types/NoParam';
import { inject, singleton } from 'tsyringe';
import { SysSchedulerEntity } from '../SysSchedulerEntity';
import type { SysSchedulerRepository } from '../SysSchedulerRepository';

@singleton()
export class SysSchedulerFManysActiveUseCase
  implements UseCase<SysSchedulerEntity[], INoParam>
{
  private sysSchedulerRepository: SysSchedulerRepository;

  constructor(
    @inject('SysSchedulerRepository')
    sysSchedulerRepository: SysSchedulerRepository,
  ) {
    this.sysSchedulerRepository = sysSchedulerRepository;
  }

  call(): Promise<Either<IFailure, SysSchedulerEntity[]>> {
    return this.sysSchedulerRepository.findManysActive();
  }
}
