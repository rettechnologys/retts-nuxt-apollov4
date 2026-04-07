import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { CSysGroupReqBody, SysGroupEntity } from '../SysGroupEntity';
import type { SysGroupRepository } from '../SysGroupRepository';

@singleton()
export class SysGroupCOnesUseCase
  implements UseCase<SysGroupEntity, CSysGroupReqBody>
{
  private sysGroupRepository: SysGroupRepository;

  constructor(
    @inject('SysGroupRepository') sysGroupRepository: SysGroupRepository,
  ) {
    this.sysGroupRepository = sysGroupRepository;
  }

  call(reqBody: CSysGroupReqBody): Promise<Either<IFailure, SysGroupEntity>> {
    return this.sysGroupRepository.createOnes(reqBody);
  }
}
