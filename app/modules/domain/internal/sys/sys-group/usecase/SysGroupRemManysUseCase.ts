import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { DManySysGroupReqBody } from '../SysGroupEntity';
import type { SysGroupRepository } from '../SysGroupRepository';

@singleton()
export class SysGroupRemManysUseCase
  implements UseCase<INonDataResponse, DManySysGroupReqBody>
{
  private sysGroupRepository: SysGroupRepository;

  constructor(
    @inject('SysGroupRepository') sysGroupRepository: SysGroupRepository,
  ) {
    this.sysGroupRepository = sysGroupRepository;
  }

  call(
    reqBody: DManySysGroupReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysGroupRepository.removeManys(reqBody);
  }
}
