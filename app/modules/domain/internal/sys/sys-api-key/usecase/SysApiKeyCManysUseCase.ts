import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { CManySysApiKeyReqBody, SysApiKeyEntity } from '../SysApiKeyEntity';
import type { SysApiKeyRepository } from '../SysApiKeyRepository';

@singleton()
export class SysApiKeyCManysUseCase
  implements UseCase<SysApiKeyEntity[], CManySysApiKeyReqBody>
{
  private SysApiKeyRepository: SysApiKeyRepository;

  constructor(
    @inject('SysApiKeyRepository') SysApiKeyRepository: SysApiKeyRepository,
  ) {
    this.SysApiKeyRepository = SysApiKeyRepository;
  }

  call(
    reqBody: CManySysApiKeyReqBody,
  ): Promise<Either<IFailure, SysApiKeyEntity[]>> {
    return this.SysApiKeyRepository.createManys(reqBody);
  }
}
