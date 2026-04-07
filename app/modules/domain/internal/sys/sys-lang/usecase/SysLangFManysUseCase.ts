import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INoParam } from '@/utils/types/NoParam';
import { inject, singleton } from 'tsyringe';
import { SysLangEntity } from '../SysLangEntity';
import type { SysLangRepository } from '../SysLangRepository';

@singleton()
export class SysLangFManysUseCase
  implements UseCase<SysLangEntity[], INoParam>
{
  private sysLangRepository: SysLangRepository;

  constructor(
    @inject('SysLangRepository') sysLangRepository: SysLangRepository,
  ) {
    this.sysLangRepository = sysLangRepository;
  }

  call(): Promise<Either<IFailure, SysLangEntity[]>> {
    return this.sysLangRepository.findManys();
  }
}
