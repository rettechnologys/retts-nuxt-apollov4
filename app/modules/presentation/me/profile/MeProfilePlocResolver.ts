import { meProfileContainer } from '~/modules//domain/internal/me/me-profile/MeProfileContainer';
import { MeProfilePloc } from './MeProfilePloc';

function instanceMeProfilePloc(): MeProfilePloc {
  return meProfileContainer.resolve(MeProfilePloc);
}

export const meProfilePlocResolver = {
  instanceMeProfilePloc,
};
