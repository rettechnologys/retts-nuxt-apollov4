import { UseCase } from '@retts-packages/utilities-helper';
import { INoParam } from '@/utils/types/NoParam';
import { inject, singleton } from 'tsyringe';
import { GlobalHealthEntity } from '../GlobalHealthEntity';
import type { GlobalRepository } from '../GlobalRepository';
import { Either } from '@retts-packages/utilities-helper';
import { IFailure } from '@/utils/types/Failure';

@singleton()
export class GlobalHealthUseCase
  implements UseCase<GlobalHealthEntity, INoParam> {
  private globalRepository: GlobalRepository;

  constructor(@inject('GlobalRepository') globalRepository: GlobalRepository) {
    this.globalRepository = globalRepository;
  }

  call(): Promise<Either<IFailure, GlobalHealthEntity>> {
    return this.globalRepository.healths();
  }
}
