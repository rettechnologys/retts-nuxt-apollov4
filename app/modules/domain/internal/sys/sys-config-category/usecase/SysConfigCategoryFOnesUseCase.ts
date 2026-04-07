import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidQuery } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import { SysConfigCategoryEntity } from '../SysConfigCategoryEntity';
import type { SysConfigCategoryRepository } from '../SysConfigCategoryRepository';

@singleton()
export class SysConfigCategoryFOnesUseCase
  implements UseCase<SysConfigCategoryEntity, IReqUidQuery>
{
  private SysConfigCategoryRepository: SysConfigCategoryRepository;

  constructor(
    @inject('SysConfigCategoryRepository')
    SysConfigCategoryRepository: SysConfigCategoryRepository,
  ) {
    this.SysConfigCategoryRepository = SysConfigCategoryRepository;
  }

  call(
    reqUidQuery: IReqUidQuery,
  ): Promise<Either<IFailure, SysConfigCategoryEntity>> {
    return this.SysConfigCategoryRepository.findOnes(
      reqUidQuery.uid.toString(),
      reqUidQuery.query,
    );
  }
}
