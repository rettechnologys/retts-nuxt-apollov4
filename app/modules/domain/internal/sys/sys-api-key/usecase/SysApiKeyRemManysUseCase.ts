import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { DManySysApiKeyReqBody } from '../SysApiKeyEntity';
import type { SysApiKeyRepository } from '../SysApiKeyRepository';

@singleton()
export class SysApiKeyRemManysUseCase
  implements UseCase<INonDataResponse, DManySysApiKeyReqBody>
{
  private SysApiKeyRepository: SysApiKeyRepository;

  constructor(
    @inject('SysApiKeyRepository') SysApiKeyRepository: SysApiKeyRepository,
  ) {
    this.SysApiKeyRepository = SysApiKeyRepository;
  }

  call(
    reqBody: DManySysApiKeyReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.SysApiKeyRepository.removeManys(reqBody);
  }
}
