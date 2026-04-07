import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import { IDataPaginationResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { SysConfigEntity } from '../SysConfigEntity';
import type { SysConfigRepository } from '../SysConfigRepository';

@singleton()
export class SysConfigFManysUseCase
  implements UseCase<IDataPaginationResponse<SysConfigEntity[]>, IReqQuery>
{
  private sysConfigRepository: SysConfigRepository;

  constructor(
    @inject('SysConfigRepository') sysConfigRepository: SysConfigRepository,
  ) {
    this.sysConfigRepository = sysConfigRepository;
  }

  call(
    query?: IReqQuery,
  ): Promise<Either<IFailure, IDataPaginationResponse<SysConfigEntity[]>>> {
    return this.sysConfigRepository.findManys(query);
  }
}
