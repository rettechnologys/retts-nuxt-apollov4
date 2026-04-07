import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { AuthEntity, LoginAzureAuthReqParam } from '../AuthEntity';
import type { AuthRepository } from '../AuthRepository';

@singleton()
export class AuthLoginAzureUseCase
  implements UseCase<AuthEntity, LoginAzureAuthReqParam>
{
  private authRepository: AuthRepository;

  constructor(@inject('AuthRepository') authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  call(param: LoginAzureAuthReqParam): Promise<Either<IFailure, AuthEntity>> {
    return this.authRepository.loginAzure(param);
  }
}
