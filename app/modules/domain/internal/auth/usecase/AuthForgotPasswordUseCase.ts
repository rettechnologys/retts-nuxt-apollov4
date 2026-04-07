import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { ForgotAuthReqBody } from '../AuthEntity';
import type { AuthRepository } from '../AuthRepository';

@singleton()
export class AuthForgotPasswordUseCase
  implements UseCase<INonDataResponse, ForgotAuthReqBody>
{
  private authRepository: AuthRepository;

  constructor(@inject('AuthRepository') authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  call(
    reqBody: ForgotAuthReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.authRepository.forgotPassword(reqBody);
  }
}
