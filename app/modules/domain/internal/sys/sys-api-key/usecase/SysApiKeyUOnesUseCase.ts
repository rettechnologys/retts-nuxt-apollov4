import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidBody } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import { SysApiKeyEntity, USysApiKeyReqBody } from '../SysApiKeyEntity';
import type { SysApiKeyRepository } from '../SysApiKeyRepository';

@singleton()
export class SysApiKeyUOnesUseCase
  implements UseCase<SysApiKeyEntity, IReqUidBody<USysApiKeyReqBody>>
{
  private SysApiKeyRepository: SysApiKeyRepository;

  constructor(
    @inject('SysApiKeyRepository') SysApiKeyRepository: SysApiKeyRepository,
  ) {
    this.SysApiKeyRepository = SysApiKeyRepository;
  }

  call(
    reqUidBody: IReqUidBody<USysApiKeyReqBody>,
  ): Promise<Either<IFailure, SysApiKeyEntity>> {
    return this.SysApiKeyRepository.updateOnes(
      reqUidBody.uid.toString(),
      reqUidBody.reqBody,
    );
  }
}
