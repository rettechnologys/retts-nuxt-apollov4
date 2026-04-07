import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import { IDataPaginationResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { SysUserEntity } from '../SysUserEntity';
import type { SysUserRepository } from '../SysUserRepository';

@singleton()
export class SysUserFManysUseCase
  implements UseCase<IDataPaginationResponse<SysUserEntity[]>, IReqQuery>
{
  private sysUserRepository: SysUserRepository;

  constructor(
    @inject('SysUserRepository') sysUserRepository: SysUserRepository,
  ) {
    this.sysUserRepository = sysUserRepository;
  }

  call(
    query?: IReqQuery,
  ): Promise<Either<IFailure, IDataPaginationResponse<SysUserEntity[]>>> {
    return this.sysUserRepository.findManys(query);
  }
}
