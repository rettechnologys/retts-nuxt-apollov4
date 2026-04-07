import { authContainer } from '../AuthContainer';
import { AuthRefreshTokenUseCase } from './AuthRefreshTokenUseCase';

function instanceAuthRefreshTokenUseCase(): AuthRefreshTokenUseCase {
  return authContainer.resolve(AuthRefreshTokenUseCase);
}

export const authUseCaseResolver = {
  instanceAuthRefreshTokenUseCase,
};
