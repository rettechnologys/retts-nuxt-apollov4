import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import { IDataPaginationResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { SysNotifManualEntity } from '../SysNotifManualEntity';
import type { SysNotifManualRepository } from '../SysNotifManualRepository';

@singleton()
export class SysNotifManualFManysUseCase
  implements
    UseCase<IDataPaginationResponse<SysNotifManualEntity[]>, IReqQuery>
{
  private sysNotifManualRepository: SysNotifManualRepository;

  constructor(
    @inject('SysNotifManualRepository')
    sysNotifManualRepository: SysNotifManualRepository,
  ) {
    this.sysNotifManualRepository = sysNotifManualRepository;
  }

  call(
    query?: IReqQuery,
  ): Promise<
    Either<IFailure, IDataPaginationResponse<SysNotifManualEntity[]>>
  > {
    return this.sysNotifManualRepository.findManys(query);
  }
}
