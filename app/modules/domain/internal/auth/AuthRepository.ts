import { Either } from '@/utils/helpers/Either';
import type { IFailure } from '@/utils/types/Failure';
import type { INonDataResponse } from '@/utils/types/ResponseInternal';
import type {
  AuthEntity,
  AuthRefreshTokenEntity,
  ForgotAuthReqBody,
  LoginAuthReqBody,
  LoginAzureAuthReqParam,
} from './AuthEntity';

export interface AuthRepository {
  login(reqBody: LoginAuthReqBody): Promise<Either<IFailure, AuthEntity>>;
  logout(): Promise<Either<IFailure, INonDataResponse>>;
  refreshToken(): Promise<Either<IFailure, AuthRefreshTokenEntity>>;
  //me(): Promise<Either<IFailure, AuthMeEntity>>;
  forgotPassword(
    reqBody: ForgotAuthReqBody,
  ): Promise<Either<IFailure, INonDataResponse>>;
  loginAzure(
    param: LoginAzureAuthReqParam,
  ): Promise<Either<IFailure, AuthEntity>>;
}
