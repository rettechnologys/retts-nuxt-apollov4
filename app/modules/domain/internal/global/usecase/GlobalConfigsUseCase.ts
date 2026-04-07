import { Either } from '@retts-packages/utilities-helper';
import { UseCase } from '@retts-packages/utilities-helper';
import { IFailure } from '@/utils/types/Failure';
import { INoParam } from '@/utils/types/NoParam';
import { inject, singleton } from 'tsyringe';
import { GlobalConfigEntity } from '../GlobalConfigEntity';
import type { GlobalRepository } from '../GlobalRepository';

@singleton()
export class GlobalConfigUseCase
  implements UseCase<GlobalConfigEntity, INoParam> {
  private globalRepository: GlobalRepository;

  constructor(@inject('GlobalRepository') globalRepository: GlobalRepository) {
    this.globalRepository = globalRepository;
  }

  call(): Promise<Either<IFailure, GlobalConfigEntity>> {
    return this.globalRepository.configs();
  }
}
