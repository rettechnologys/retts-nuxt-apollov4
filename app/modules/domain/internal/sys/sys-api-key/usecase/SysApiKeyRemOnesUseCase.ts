import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysApiKeyEntity } from '../SysApiKeyEntity';
import type { SysApiKeyRepository } from '../SysApiKeyRepository';

@singleton()
export class SysApiKeyRemOnesUseCase
  implements UseCase<SysApiKeyEntity, string>
{
  private SysApiKeyRepository: SysApiKeyRepository;

  constructor(
    @inject('SysApiKeyRepository') SysApiKeyRepository: SysApiKeyRepository,
  ) {
    this.SysApiKeyRepository = SysApiKeyRepository;
  }

  call(uuid: string): Promise<Either<IFailure, SysApiKeyEntity>> {
    return this.SysApiKeyRepository.removeOnes(uuid);
  }
}
