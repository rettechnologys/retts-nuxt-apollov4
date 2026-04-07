import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysSchedulerEntity } from '../SysSchedulerEntity';
import type { SysSchedulerRepository } from '../SysSchedulerRepository';

@singleton()
export class SysSchedulerFOnesUseCase
  implements UseCase<SysSchedulerEntity, string>
{
  private sysSchedulerRepository: SysSchedulerRepository;

  constructor(
    @inject('SysSchedulerRepository')
    sysSchedulerRepository: SysSchedulerRepository,
  ) {
    this.sysSchedulerRepository = sysSchedulerRepository;
  }

  call(uuid: string): Promise<Either<IFailure, SysSchedulerEntity>> {
    return this.sysSchedulerRepository.findOnes(uuid);
  }
}
