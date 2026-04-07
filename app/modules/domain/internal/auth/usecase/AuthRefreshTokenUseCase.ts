import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INoParam } from '@/utils/types/NoParam';
import { inject, singleton } from 'tsyringe';
import { AuthRefreshTokenEntity } from '../AuthEntity';
import type { AuthRepository } from '../AuthRepository';

@singleton()
export class AuthRefreshTokenUseCase
  implements UseCase<AuthRefreshTokenEntity, INoParam>
{
  private authRepository: AuthRepository;

  constructor(@inject('AuthRepository') authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  call(): Promise<Either<IFailure, AuthRefreshTokenEntity>> {
    return this.authRepository.refreshToken();
  }
}
