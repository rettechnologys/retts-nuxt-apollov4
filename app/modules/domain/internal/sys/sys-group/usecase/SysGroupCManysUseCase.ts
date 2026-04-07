import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { CManySysGroupReqBody, SysGroupEntity } from '../SysGroupEntity';
import type { SysGroupRepository } from '../SysGroupRepository';

@singleton()
export class SysGroupCManysUseCase
  implements UseCase<SysGroupEntity[], CManySysGroupReqBody>
{
  private sysGroupRepository: SysGroupRepository;

  constructor(
    @inject('SysGroupRepository') sysGroupRepository: SysGroupRepository,
  ) {
    this.sysGroupRepository = sysGroupRepository;
  }

  call(
    reqBody: CManySysGroupReqBody,
  ): Promise<Either<IFailure, SysGroupEntity[]>> {
    return this.sysGroupRepository.createManys(reqBody);
  }
}
