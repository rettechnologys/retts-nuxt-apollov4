import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { AuthEntity, LoginAuthReqBody } from '../AuthEntity';
import type { AuthRepository } from '../AuthRepository';

@singleton()
export class AuthLoginUseCase implements UseCase<AuthEntity, LoginAuthReqBody> {
  private authRepository: AuthRepository;

  constructor(@inject('AuthRepository') authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  call(reqBody: LoginAuthReqBody): Promise<Either<IFailure, AuthEntity>> {
    return this.authRepository.login(reqBody);
  }
}
