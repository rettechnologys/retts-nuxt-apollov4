import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidQuery } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import { SysNotifCategoryEntity } from '../SysNotifCategoryEntity';
import type { SysNotifCategoryRepository } from '../SysNotifCategoryRepository';

@singleton()
export class SysNotifCategoryFOnesUseCase
  implements UseCase<SysNotifCategoryEntity, IReqUidQuery>
{
  private sysNotifCategoryRepository: SysNotifCategoryRepository;

  constructor(
    @inject('SysNotifCategoryRepository')
    sysNotifCategoryRepository: SysNotifCategoryRepository,
  ) {
    this.sysNotifCategoryRepository = sysNotifCategoryRepository;
  }

  call(
    reqUidQuery: IReqUidQuery,
  ): Promise<Either<IFailure, SysNotifCategoryEntity>> {
    return this.sysNotifCategoryRepository.findOnes(
      reqUidQuery.uid.toString(),
      reqUidQuery.query,
    );
  }
}
