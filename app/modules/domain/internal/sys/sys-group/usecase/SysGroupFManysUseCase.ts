import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import { IDataPaginationResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { SysGroupEntity } from '../SysGroupEntity';
import type { SysGroupRepository } from '../SysGroupRepository';

@singleton()
export class SysGroupFManysUseCase
  implements UseCase<IDataPaginationResponse<SysGroupEntity[]>, IReqQuery>
{
  private sysGroupRepository: SysGroupRepository;

  constructor(
    @inject('SysGroupRepository') sysGroupRepository: SysGroupRepository,
  ) {
    this.sysGroupRepository = sysGroupRepository;
  }

  call(
    query?: IReqQuery,
  ): Promise<Either<IFailure, IDataPaginationResponse<SysGroupEntity[]>>> {
    return this.sysGroupRepository.findManys(query);
  }
}
