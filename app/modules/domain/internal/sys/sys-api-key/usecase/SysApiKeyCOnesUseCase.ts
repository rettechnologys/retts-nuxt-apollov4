import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { CSysApiKeyReqBody, SysApiKeyEntity } from '../SysApiKeyEntity';
import type { SysApiKeyRepository } from '../SysApiKeyRepository';

@singleton()
export class SysApiKeyCOnesUseCase
  implements UseCase<SysApiKeyEntity, CSysApiKeyReqBody>
{
  private SysApiRepository: SysApiKeyRepository;

  constructor(
    @inject('SysApiKeyRepository') SysApiRepository: SysApiKeyRepository,
  ) {
    this.SysApiRepository = SysApiRepository;
  }

  call(reqBody: CSysApiKeyReqBody): Promise<Either<IFailure, SysApiKeyEntity>> {
    return this.SysApiRepository.createOnes(reqBody);
  }
}
