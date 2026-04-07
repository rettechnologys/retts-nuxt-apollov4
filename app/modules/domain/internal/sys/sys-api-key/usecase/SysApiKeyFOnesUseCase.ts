import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidQuery } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import { SysApiKeyEntity } from '../SysApiKeyEntity';
import type { SysApiKeyRepository } from '../SysApiKeyRepository';

@singleton()
export class SysApiKeyFOnesUseCase
  implements UseCase<SysApiKeyEntity, IReqUidQuery>
{
  private SysApiKeyRepository: SysApiKeyRepository;

  constructor(
    @inject('SysApiKeyRepository') SysApiKeyRepository: SysApiKeyRepository,
  ) {
    this.SysApiKeyRepository = SysApiKeyRepository;
  }

  call(reqUidQuery: IReqUidQuery): Promise<Either<IFailure, SysApiKeyEntity>> {
    return this.SysApiKeyRepository.findOnes(
      reqUidQuery.uid.toString(),
      reqUidQuery.query,
    );
  }
}
