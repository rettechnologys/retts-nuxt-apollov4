import { Auth } from '@/modules/data/internal/data-source/Auth';
import { AuthRepositoryImpl } from '@/modules/data/internal/repository/AuthRepositoryImpl';
import { container } from 'tsyringe';
import {
  AuthForgotPasswordUseCase,
  AuthLoginAzureUseCase,
  AuthLoginUseCase,
  AuthLogoutUseCase,
  AuthRefreshTokenUseCase,
} from './usecase';

export const authContainer = container.createChildContainer();

//#region Container HttpClient
authContainer.register('Auth', {
  useClass: Auth,
});
//#endregion Container HttpClient

//#region Container RepositoryImpl
authContainer.register('AuthRepository', {
  useClass: AuthRepositoryImpl,
});
//#endregion Container RepositoryImpl

//#region Container Usecase
authContainer.register('AuthLoginUseCase', {
  useClass: AuthLoginUseCase,
});

authContainer.register('AuthLogoutUseCase', {
  useClass: AuthLogoutUseCase,
});

authContainer.register('AuthRefreshTokenUseCase', {
  useClass: AuthRefreshTokenUseCase,
});

// authContainer.register('AuthMeUseCase', {
//   useClass: AuthMeUseCase,
// });

authContainer.register('AuthForgotPasswordUseCase', {
  useClass: AuthForgotPasswordUseCase,
});

authContainer.register('AuthLoginAzureUseCase', {
  useClass: AuthLoginAzureUseCase,
});
//#endregion Container Usecase
