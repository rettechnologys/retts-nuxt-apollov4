import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INoParam } from '@/utils/types/NoParam';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import type { AuthRepository } from '../AuthRepository';

@singleton()
export class AuthLogoutUseCase implements UseCase<INonDataResponse, INoParam> {
  private authRepository: AuthRepository;

  constructor(@inject('AuthRepository') authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  call(): Promise<Either<IFailure, INonDataResponse>> {
    return this.authRepository.logout();
  }
}
