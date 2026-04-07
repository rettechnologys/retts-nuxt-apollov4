import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysLangEntity } from '../SysLangEntity';
import type { SysLangRepository } from '../SysLangRepository';

@singleton()
export class SysLangRecOnesUseCase implements UseCase<SysLangEntity, string> {
  private sysLangRepository: SysLangRepository;

  constructor(
    @inject('SysLangRepository') sysLangRepository: SysLangRepository,
  ) {
    this.sysLangRepository = sysLangRepository;
  }

  call(id: string): Promise<Either<IFailure, SysLangEntity>> {
    return this.sysLangRepository.recoverOnes(id);
  }
}
