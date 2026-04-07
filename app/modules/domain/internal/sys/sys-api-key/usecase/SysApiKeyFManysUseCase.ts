import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import { IDataPaginationResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { SysApiKeyEntity } from '../SysApiKeyEntity';
import type { SysApiKeyRepository } from '../SysApiKeyRepository';

@singleton()
export class SysApiKeyFManysUseCase
  implements UseCase<IDataPaginationResponse<SysApiKeyEntity[]>, IReqQuery>
{
  private SysApiKeyRepository: SysApiKeyRepository;

  constructor(
    @inject('SysApiKeyRepository') SysApiKeyRepository: SysApiKeyRepository,
  ) {
    this.SysApiKeyRepository = SysApiKeyRepository;
  }

  call(
    query?: IReqQuery,
  ): Promise<Either<IFailure, IDataPaginationResponse<SysApiKeyEntity[]>>> {
    return this.SysApiKeyRepository.findManys(query);
  }
}
