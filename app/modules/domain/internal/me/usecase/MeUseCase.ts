import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INoParam } from '@/utils/types/NoParam';
import { inject, singleton } from 'tsyringe';
import { MeEntity } from '../MeEntity';
import type { MeRepository } from '../MeRepository';

@singleton()
export class MeUseCase implements UseCase<MeEntity, INoParam> {
  private meRepository: MeRepository;

  constructor(@inject('MeRepository') meRepository: MeRepository) {
    this.meRepository = meRepository;
  }

  call(): Promise<Either<IFailure, MeEntity>> {
    return this.meRepository.me();
  }
}
