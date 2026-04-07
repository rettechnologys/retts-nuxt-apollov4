import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { CUSysLangReqBody, SysLangEntity } from '../SysLangEntity';
import type { SysLangRepository } from '../SysLangRepository';

@singleton()
export class SysLangCUOnesUseCase
  implements UseCase<SysLangEntity, CUSysLangReqBody>
{
  private sysLangRepository: SysLangRepository;

  constructor(
    @inject('SysLangRepository') sysLangRepository: SysLangRepository,
  ) {
    this.sysLangRepository = sysLangRepository;
  }

  call(reqBody: CUSysLangReqBody): Promise<Either<IFailure, SysLangEntity>> {
    return this.sysLangRepository.createUpdateOnes(reqBody);
  }
}
