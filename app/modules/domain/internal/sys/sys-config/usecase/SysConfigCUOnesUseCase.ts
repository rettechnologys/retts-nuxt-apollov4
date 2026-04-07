import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { CUSysConfigReqBody, SysConfigEntity } from '../SysConfigEntity';
import type { SysConfigRepository } from '../SysConfigRepository';

@singleton()
export class SysConfigCUOnesUseCase
  implements UseCase<SysConfigEntity, CUSysConfigReqBody>
{
  private sysConfigRepository: SysConfigRepository;

  constructor(
    @inject('SysConfigRepository') sysConfigRepository: SysConfigRepository,
  ) {
    this.sysConfigRepository = sysConfigRepository;
  }

  call(
    reqBody: CUSysConfigReqBody,
  ): Promise<Either<IFailure, SysConfigEntity>> {
    return this.sysConfigRepository.createUpdateOnes(reqBody);
  }
}
