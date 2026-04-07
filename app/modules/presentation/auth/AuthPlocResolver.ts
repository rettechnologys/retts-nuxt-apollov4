import { authContainer } from '~/modules//domain/internal/auth/AuthContainer';
import { AuthPloc } from './AuthPloc';

function instanceAuthPloc(): AuthPloc {
  return authContainer.resolve(AuthPloc);
}

export const authPlocResolver = {
  instanceAuthPloc,
};
