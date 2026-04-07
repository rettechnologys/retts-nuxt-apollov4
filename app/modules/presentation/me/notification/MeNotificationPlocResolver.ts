import { meNotificationContainer } from '~/modules//domain/internal/me/me-notification/MeNotificationContainer';
import { MeNotificationPloc } from './MeNotificationPloc';

function instanceMeNotificationPloc(): MeNotificationPloc {
  return meNotificationContainer.resolve(MeNotificationPloc);
}

export const meNotificationPlocResolver = {
  instanceMeNotificationPloc,
};
