import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysGroupEntity, URManySysGroupReqBody } from '../SysGroupEntity';
import type { SysGroupRepository } from '../SysGroupRepository';

@singleton()
export class SysGroupRepManysUseCase
  implements UseCase<SysGroupEntity[], URManySysGroupReqBody>
{
  private sysGroupRepository: SysGroupRepository;

  constructor(
    @inject('SysGroupRepository') sysGroupRepository: SysGroupRepository,
  ) {
    this.sysGroupRepository = sysGroupRepository;
  }

  call(
    reqBody: URManySysGroupReqBody,
  ): Promise<Either<IFailure, SysGroupEntity[]>> {
    return this.sysGroupRepository.replaceManys(reqBody);
  }
}
