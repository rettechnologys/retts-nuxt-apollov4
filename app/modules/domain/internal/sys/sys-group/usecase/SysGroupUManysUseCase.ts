import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { UManySysGroupReqBody } from '../SysGroupEntity';
import type { SysGroupRepository } from '../SysGroupRepository';

@singleton()
export class SysGroupUManysUseCase
  implements UseCase<INonDataResponse, UManySysGroupReqBody>
{
  private sysGroupRepository: SysGroupRepository;

  constructor(
    @inject('SysGroupRepository') sysGroupRepository: SysGroupRepository,
  ) {
    this.sysGroupRepository = sysGroupRepository;
  }

  call(
    reqBody: UManySysGroupReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysGroupRepository.updateManys(reqBody);
  }
}
