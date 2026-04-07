import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import { IDataPaginationResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { SysNotifCategoryEntity } from '../SysNotifCategoryEntity';
import type { SysNotifCategoryRepository } from '../SysNotifCategoryRepository';

@singleton()
export class SysNotifCategoryFManysUseCase
  implements
    UseCase<IDataPaginationResponse<SysNotifCategoryEntity[]>, IReqQuery>
{
  private sysNotifCategoryRepository: SysNotifCategoryRepository;

  constructor(
    @inject('SysNotifCategoryRepository')
    sysNotifCategoryRepository: SysNotifCategoryRepository,
  ) {
    this.sysNotifCategoryRepository = sysNotifCategoryRepository;
  }

  call(
    query?: IReqQuery,
  ): Promise<
    Either<IFailure, IDataPaginationResponse<SysNotifCategoryEntity[]>>
  > {
    return this.sysNotifCategoryRepository.findManys(query);
  }
}
