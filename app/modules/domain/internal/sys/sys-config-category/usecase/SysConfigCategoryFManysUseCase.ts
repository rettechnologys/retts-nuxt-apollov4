import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import { IDataPaginationResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { SysConfigCategoryEntity } from '../SysConfigCategoryEntity';
import type { SysConfigCategoryRepository } from '../SysConfigCategoryRepository';

@singleton()
export class SysConfigCategoryFManysUseCase
  implements
    UseCase<IDataPaginationResponse<SysConfigCategoryEntity[]>, IReqQuery>
{
  private SysConfigCategoryRepository: SysConfigCategoryRepository;

  constructor(
    @inject('SysConfigCategoryRepository')
    SysConfigCategoryRepository: SysConfigCategoryRepository,
  ) {
    this.SysConfigCategoryRepository = SysConfigCategoryRepository;
  }

  call(
    query?: IReqQuery,
  ): Promise<
    Either<IFailure, IDataPaginationResponse<SysConfigCategoryEntity[]>>
  > {
    return this.SysConfigCategoryRepository.findManys(query);
  }
}
