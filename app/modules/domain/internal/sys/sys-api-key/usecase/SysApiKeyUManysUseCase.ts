import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { UManySysApiKeyReqBody } from '../SysApiKeyEntity';
import type { SysApiKeyRepository } from '../SysApiKeyRepository';

@singleton()
export class SysApiKeyUManysUseCase
  implements UseCase<INonDataResponse, UManySysApiKeyReqBody>
{
  private SysApiKeyRepository: SysApiKeyRepository;

  constructor(
    @inject('SysApiKeyRepository') SysApiKeyRepository: SysApiKeyRepository,
  ) {
    this.SysApiKeyRepository = SysApiKeyRepository;
  }

  call(
    reqBody: UManySysApiKeyReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.SysApiKeyRepository.updateManys(reqBody);
  }
}
