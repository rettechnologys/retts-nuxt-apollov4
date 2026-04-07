import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysNotifCategoryEntity } from '../SysNotifCategoryEntity';
import type { SysNotifCategoryRepository } from '../SysNotifCategoryRepository';

@singleton()
export class SysNotifCategoryRemOnesUseCase
  implements UseCase<SysNotifCategoryEntity, string>
{
  private sysNotifCategoryRepository: SysNotifCategoryRepository;

  constructor(
    @inject('SysNotifCategoryRepository')
    sysNotifCategoryRepository: SysNotifCategoryRepository,
  ) {
    this.sysNotifCategoryRepository = sysNotifCategoryRepository;
  }

  call(uuid: string): Promise<Either<IFailure, SysNotifCategoryEntity>> {
    return this.sysNotifCategoryRepository.removeOnes(uuid);
  }
}
