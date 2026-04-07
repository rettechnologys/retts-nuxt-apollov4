import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysConfigCategoryEntity } from '../SysConfigCategoryEntity';
import type { SysConfigCategoryRepository } from '../SysConfigCategoryRepository';

@singleton()
export class SysConfigCategoryRemOnesUseCase
  implements UseCase<SysConfigCategoryEntity, string>
{
  private SysConfigCategoryRepository: SysConfigCategoryRepository;

  constructor(
    @inject('SysConfigCategoryRepository')
    SysConfigCategoryRepository: SysConfigCategoryRepository,
  ) {
    this.SysConfigCategoryRepository = SysConfigCategoryRepository;
  }

  call(uuid: string): Promise<Either<IFailure, SysConfigCategoryEntity>> {
    return this.SysConfigCategoryRepository.removeOnes(uuid);
  }
}
