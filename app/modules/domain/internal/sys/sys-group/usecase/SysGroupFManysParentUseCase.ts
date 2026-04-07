import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INoParam } from '@/utils/types/NoParam';
import { inject, singleton } from 'tsyringe';
import { SysGroupParentEntity } from '../SysGroupParentEntity';
import type { SysGroupRepository } from '../SysGroupRepository';

@singleton()
export class SysGroupFManysParentUseCase
  implements UseCase<SysGroupParentEntity[], INoParam>
{
  private sysGroupRepository: SysGroupRepository;

  constructor(
    @inject('SysGroupRepository') sysGroupRepository: SysGroupRepository,
  ) {
    this.sysGroupRepository = sysGroupRepository;
  }

  call(): Promise<Either<IFailure, SysGroupParentEntity[]>> {
    return this.sysGroupRepository.findManysParent();
  }
}
